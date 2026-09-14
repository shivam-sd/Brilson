import {
    createAsyncThunk,
    createSlice
} from "@reduxjs/toolkit";

import axios from "axios";



export const fetchCart = createAsyncThunk(
    "cart/fetchCart",

    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;

            // Logged-in user → fetch cart from DB
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

            // Guest user → keep Redux cart
            return getState().cart.cartItems || [];

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to load cart"
            );
        }
    }
);


export const addToCart = createAsyncThunk(
    "cart/addToCart",

    async (product, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
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
                    cartItems: res.data.cartItems || [],
                };
            }

            const cart = getState().cart.cartItems || [];

            const index = cart.findIndex((item) => {
                const productId =
                    typeof item.productId === "object"
                        ? item.productId?._id
                        : item.productId;

                return productId === product._id;
            });


            let updatedCart;


            // Product already exists in guest cart
            if (index >= 0) {
                updatedCart = cart.map(
                    (item, itemIndex) =>
                        itemIndex === index
                            ? {
                                ...item,
                                quantity:
                                    (Number(item.quantity) || 0) + 1,
                            }
                            : item
                );
            }

            // New product
            else {
                updatedCart = [
                    ...cart,
                    {
                        productId: {
                            _id: product._id,
                            title: product.title,
                            price: product.price,
                            images: product.images,
                            coverImg: product.coverImg,
                            gst: product.gst,
                            discount: product.discount,
                        },

                        productTitle: product.title,
                        title: product.title,
                        price: product.price,

                        image:
                            product.coverImg ||
                            product.images?.[0],

                        quantity: 1,

                        color: product.color,
                    },
                ];
            }


            return {
                type: "local",
                cartItems: updatedCart,
            };

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to add item"
            );
        }
    }
);


export const mergeGuestCart = createAsyncThunk(
    "cart/mergeGuestCart",

    async (guestCartItems, {
        getState,
        rejectWithValue
    }) => {

        try {
            const token = getState().auth.token;


            if (!token) {
                return rejectWithValue(
                    "User is not logged in"
                );
            }


            if (
                !Array.isArray(guestCartItems) ||
                guestCartItems.length === 0
            ) {
                return {
                    type: "merge",
                    cartItems: null,
                };
            }


            const items = guestCartItems
                .map((item) => {

                    const productId =
                        typeof item.productId === "object"
                            ? item.productId?._id
                            : item.productId;


                    const quantity =
                        Number(item.quantity) || 1;


                    return {
                        productId,
                        quantity,
                    };
                })

                // remove invalid items
                .filter(
                    (item) =>
                        item.productId &&
                        item.quantity > 0
                );


            if (items.length === 0) {
                return {
                    type: "merge",
                    cartItems: null,
                };
            }


            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/cart/merge`,

                {
                    items,
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            return {
                type: "merge",
                cartItems:
                    res.data.cartItems || [],
            };

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to merge guest cart"
            );
        }
    }
);



export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",

    async (cartId, {
        getState,
        rejectWithValue
    }) => {

        try {
            const token = getState().auth.token;



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



            const cart =
                getState().cart.cartItems || [];


            const updatedCart =
                cart.filter((item) => {

                    const productId =
                        typeof item.productId === "object"
                            ? item.productId?._id
                            : item.productId;


                    return productId !== cartId;
                });


            return {
                cartId,
                cartItems: updatedCart,
            };

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to remove item"
            );
        }
    }
);


export const updateCartQuantity = createAsyncThunk(
    "cart/updateCartQuantity",

    async (
        {
            cartId,
            quantity
        },
        {
            getState,
            rejectWithValue
        }
    ) => {

        try {

            const token =
                getState().auth.token;


            const parsedQuantity =
                Number(quantity);


            if (
                !Number.isFinite(parsedQuantity) ||
                parsedQuantity < 1
            ) {
                return rejectWithValue(
                    "Invalid quantity"
                );
            }



            if (token) {

                await axios.put(
                    `${import.meta.env.VITE_BASE_URL}/api/cart/update/${cartId}`,

                    {
                        quantity: parsedQuantity,
                    },

                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );


                return {
                    cartId,
                    quantity: parsedQuantity,
                };
            }

            const cart =
                getState().cart.cartItems || [];


            const updatedCart =
                cart.map((item) => {

                    const productId =
                        typeof item.productId === "object"
                            ? item.productId?._id
                            : item.productId;


                    if (productId === cartId) {

                        return {
                            ...item,
                            quantity:
                                parsedQuantity,
                        };
                    }


                    return item;
                });


            return {
                cartId,
                quantity:
                    parsedQuantity,

                cartItems:
                    updatedCart,
            };

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
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

        mergeLoading: false,

        error: null,
    },



    reducers: {

        clearCart: (state) => {

            state.cartItems = [];

            state.error = null;
        },


        setCartItems: (state, action) => {

            state.cartItems =
                action.payload || [];
        },
    },


    /* 
       ASYNC REDUCERS*/

    extraReducers: (builder) => {

        builder


            /*
               FETCH CART */

            .addCase(
                fetchCart.pending,
                (state) => {

                    state.fetchLoading = true;

                    state.error = null;
                }
            )


            .addCase(
                fetchCart.fulfilled,
                (state, action) => {

                    state.fetchLoading = false;

                    state.cartItems =
                        action.payload || [];
                }
            )


            .addCase(
                fetchCart.rejected,
                (state, action) => {

                    state.fetchLoading = false;

                    state.error =
                        action.payload;
                }
            )



            /*
               ADD TO CART
                */

            .addCase(
                addToCart.pending,
                (state, action) => {

                    state.actionLoading = true;

                    state.actionItemId =
                        action.meta.arg?._id ||
                        null;

                    state.error = null;
                }
            )


            .addCase(
                addToCart.fulfilled,
                (state, action) => {

                    state.actionLoading = false;

                    state.actionItemId = null;


                    if (
                        action.payload?.cartItems
                    ) {

                        state.cartItems =
                            action.payload.cartItems;
                    }
                }
            )


            .addCase(
                addToCart.rejected,
                (state, action) => {

                    state.actionLoading = false;

                    state.actionItemId = null;

                    state.error =
                        action.payload;
                }
            )



            /* 
               MERGE GUEST CART
               */

            .addCase(
                mergeGuestCart.pending,
                (state) => {

                    state.mergeLoading = true;

                    state.error = null;
                }
            )


            .addCase(
                mergeGuestCart.fulfilled,
                (state, action) => {

                    state.mergeLoading = false;
                    if (
                        action.payload?.cartItems !== null &&
                        action.payload?.cartItems !== undefined
                    ) {

                        state.cartItems =
                            action.payload.cartItems;
                    }
                }
            )


            .addCase(
                mergeGuestCart.rejected,
                (state, action) => {

                    state.mergeLoading = false;

                    state.error =
                        action.payload;
                }
            )



            /*
               REMOVE FROM CART
               */

            .addCase(
                removeFromCart.pending,
                (state, action) => {

                    state.actionLoading = true;

                    state.actionItemId =
                        action.meta.arg;

                    state.error = null;
                }
            )


            .addCase(
                removeFromCart.fulfilled,
                (state, action) => {

                    state.actionLoading = false;

                    state.actionItemId = null;


                    if (
                        action.payload?.cartItems
                    ) {

                        state.cartItems =
                            action.payload.cartItems;

                        return;
                    }



                    const {
                        cartId
                    } = action.payload;


                    state.cartItems =
                        state.cartItems.filter(
                            (item) =>

                                item._id !==
                                cartId &&

                                item.productId?._id !==
                                cartId &&

                                item.productId !==
                                cartId
                        );
                }
            )


            .addCase(
                removeFromCart.rejected,
                (state, action) => {

                    state.actionLoading = false;

                    state.actionItemId = null;

                    state.error =
                        action.payload;
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


                    /*
                     Guest cart returns
                     full updated array.
                    */

                    if (
                        action.payload?.cartItems
                    ) {

                        state.cartItems =
                            action.payload.cartItems;

                        return;
                    }


                    /*
                     Logged-in cart:
                     update quantity locally.
                    */

                    const {
                        cartId,
                        quantity
                    } = action.payload;


                    const item =
                        state.cartItems.find(
                            (item) =>

                                item._id ===
                                cartId ||

                                item.productId?._id ===
                                cartId ||

                                item.productId ===
                                cartId
                        );


                    if (item) {

                        item.quantity =
                            quantity;
                    }
                }
            )


            .addCase(
                updateCartQuantity.rejected,
                (state, action) => {

                    state.actionLoading = false;

                    state.actionItemId = null;

                    state.error =
                        action.payload;
                }
            );
    },
});


export const {
    clearCart,
    setCartItems,
} = cartSlice.actions;


export const selectCartItems =
    (state) =>
        state.cart.cartItems;


export const selectCartLoading =
    (state) =>
        state.cart.fetchLoading;


export const selectCartActionLoading =
    (state) =>
        state.cart.actionLoading;


export const selectCartActionItemId =
    (state) =>
        state.cart.actionItemId;


export const selectCartMergeLoading =
    (state) =>
        state.cart.mergeLoading;


export const selectCartError =
    (state) =>
        state.cart.error;


export const selectCartCount =
    (state) =>

        state.cart.cartItems.reduce(

            (total, item) =>

                total +
                (Number(item.quantity) || 0),

            0
        );

export default cartSlice.reducer;