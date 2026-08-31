
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const getToken = () => {
    return localStorage.getItem("token");
};

const getLocalCart = () => {
    try {
        return JSON.parse(
            localStorage.getItem("cart") || "[]"
        );
    } catch {
        return [];
    }
};

const saveLocalCart = (cart) => {
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
};

export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (_, { rejectWithValue }) => {
        try {
            const token = getToken();

            if (token) {
                const res = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/api/cart/user`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                return res.data.cartItems || [];
            }

            return getLocalCart();
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to load cart"
            );
        }
    }
);

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async (product, { rejectWithValue }) => {
        try {
            const token = getToken();

            if (token) {
                const res = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/api/cart/add`,
                    {
                        productId: product._id,
                        quantity: 1,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                return {
                    type: "server",
                    cartItems:
                        res.data.cartItems || null,
                };
            }

            const cart = getLocalCart();

            const index = cart.findIndex((item) => {
                const productId =
                    typeof item.productId === "object"
                        ? item.productId?._id
                        : item.productId;

                return productId === product._id;
            });

            let updatedCart;

            if (index >= 0) {
                updatedCart = cart.map(
                    (item, itemIndex) =>
                        itemIndex === index
                            ? {
                                ...item,
                                quantity:
                                    (item.quantity || 0) + 1,
                            }
                            : item
                );
            } else {
                updatedCart = [
                    ...cart,
                    {
                        productId: {
                            _id: product._id,
                            title: product.title,
                            price: product.price,
                            images: product.images,
                            gst: product.gst,
                            discount: product.discount,
                        },
                        productTitle: product.title,
                        title: product.title,
                        price: product.price,
                        image: product.images?.[0],
                        quantity: 1,
                        color: product.color,
                    },
                ];
            }

            saveLocalCart(updatedCart);

            return {
                type: "local",
                cartItems: updatedCart,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to add item"
            );
        }
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (cartId, { rejectWithValue }) => {
        try {
            const token = getToken();

            if (token) {
                await axios.delete(
                    `${import.meta.env.VITE_BASE_URL}/api/cart/remove/${cartId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                return {
                    cartId,
                };
            }

            const cart = getLocalCart();

            const updatedCart =
                cart.filter((item) => {
                    const productId =
                        typeof item.productId === "object"
                            ? item.productId?._id
                            : item.productId;

                    return productId !== cartId;
                });

            saveLocalCart(updatedCart);

            return {
                cartId,
                cartItems: updatedCart,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to remove item"
            );
        }
    }
);

export const updateCartQuantity = createAsyncThunk(
    "cart/updateCartQuantity",
    async (
        { cartId, quantity },
        { rejectWithValue }
    ) => {
        try {
            const token = getToken();

            if (token) {
                await axios.put(
                    `${import.meta.env.VITE_BASE_URL}/api/cart/update/${cartId}`,
                    { quantity },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                return {
                    cartId,
                    quantity,
                };
            }

            const cart = getLocalCart();

            const updatedCart = cart.map((item) => {
                const productId =
                    typeof item.productId === "object"
                        ? item.productId?._id
                        : item.productId;

                if (productId === cartId) {
                    return {
                        ...item,
                        quantity,
                    };
                }

                return item;
            });

            saveLocalCart(updatedCart);

            return {
                cartId,
                quantity,
                cartItems: updatedCart,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to update quantity"
            );
        }
    }
);

const cartSlice = createSlice({
    name: "cart",

    initialState: {
        cartItems: [],
        fetchLoading: false,
        actionLoading: false,
        actionItemId: null,
        error: null,
    },

    reducers: {
        clearCart: (state) => {
            state.cartItems = [];
            state.error = null;
        },

        setCartItems: (state, action) => {
            state.cartItems = action.payload || [];
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.fetchLoading = true;
                state.error = null;
            })

            .addCase(fetchCart.fulfilled, (state, action) => {
                state.fetchLoading = false;
                state.cartItems = action.payload || [];
            })

            .addCase(fetchCart.rejected, (state, action) => {
                state.fetchLoading = false;
                state.error = action.payload;
            })

            .addCase(addToCart.pending, (state, action) => {
                state.actionLoading = true;
                state.actionItemId =
                    action.meta.arg?._id || null;
                state.error = null;
            })

            .addCase(addToCart.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.actionItemId = null;

                if (action.payload?.cartItems) {
                    state.cartItems =
                        action.payload.cartItems;
                }
            })

            .addCase(addToCart.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionItemId = null;
                state.error = action.payload;
            })

            .addCase(removeFromCart.pending, (state, action) => {
                state.actionLoading = true;
                state.actionItemId = action.meta.arg;
                state.error = null;
            })

            .addCase(
                removeFromCart.fulfilled,
                (state, action) => {
                    state.actionLoading = false;
                    state.actionItemId = null;

                    if (action.payload.cartItems) {
                        state.cartItems =
                            action.payload.cartItems;

                        return;
                    }

                    const { cartId } =
                        action.payload;

                    state.cartItems =
                        state.cartItems.filter(
                            (item) =>
                                item._id !== cartId &&
                                item.productId?._id !== cartId &&
                                item.productId !== cartId
                        );
                }
            )

            .addCase(
                removeFromCart.rejected,
                (state, action) => {
                    state.actionLoading = false;
                    state.actionItemId = null;
                    state.error = action.payload;
                }
            )

            .addCase(
                updateCartQuantity.pending,
                (state, action) => {
                    state.actionLoading = true;
                    state.actionItemId =
                        action.meta.arg.cartId;
                    state.error = null;
                }
            )

            .addCase(
                updateCartQuantity.fulfilled,
                (state, action) => {
                    state.actionLoading = false;
                    state.actionItemId = null;

                    if (action.payload.cartItems) {
                        state.cartItems =
                            action.payload.cartItems;

                        return;
                    }

                    const {
                        cartId,
                        quantity,
                    } = action.payload;

                    const item =
                        state.cartItems.find(
                            (item) =>
                                item._id === cartId ||
                                item.productId?._id === cartId ||
                                item.productId === cartId
                        );

                    if (item) {
                        item.quantity = quantity;
                    }
                }
            )

            .addCase(
                updateCartQuantity.rejected,
                (state, action) => {
                    state.actionLoading = false;
                    state.actionItemId = null;
                    state.error = action.payload;
                }
            );
    },
});

export const {
    clearCart,
    setCartItems,
} = cartSlice.actions;

export const selectCartItems = (state) =>
    state.cart.cartItems;

export const selectCartLoading = (state) =>
    state.cart.fetchLoading;

export const selectCartActionLoading = (state) =>
    state.cart.actionLoading;

export const selectCartActionItemId = (state) =>
    state.cart.actionItemId;

export const selectCartError = (state) =>
    state.cart.error;

export const selectCartCount = (state) =>
    state.cart.cartItems.reduce(
        (total, item) =>
            total + (Number(item.quantity) || 0),
        0
    );

export default cartSlice.reducer;
