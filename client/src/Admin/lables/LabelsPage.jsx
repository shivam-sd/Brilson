import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";
import { QRCodeSVG } from "qrcode.react";
import { useGetLabelsData } from "../../api/dashboard-query";
import { Printer, ArrowLeft } from "lucide-react";

const LabelsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const printRef = useRef(null);
    const [labelSize, setLabelSize] = useState("3x6");

    const selectedOrders = location.state?.selectedOrders || [];
    const {
        mutate: fetchLabelsData,
        data: labelsData,
        isPending
    } = useGetLabelsData();

    useEffect(() => {
        if (selectedOrders.length > 0) {
            fetchLabelsData(selectedOrders);
        }
    }, [selectedOrders, fetchLabelsData]);

    const getPageSizeCSS = () => {
        if (labelSize === "3x5") {
            return "@page { size: 3in 5in; margin: 0; }";
        }

        if (labelSize === "3x6") {
            return "@page { size: 3in 6in; margin: 0; }";
        }

        return "@page { size: 3in 3in; margin: 0; }";
    };

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Shipping_Labels_${Date.now()}`,
        pageStyle: `
            @media print {
                ${getPageSizeCSS()}

                html,
                body {
                    margin: 0 !important;
                    padding: 0 !important;
                    background: #fff !important;
                }

                * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }

                .shipping-print-page {
                    box-sizing: border-box !important;
                    width: 100% !important;
                    padding-top: 2px !important;
                    padding-bottom: 0 !important;
                    page-break-after: always !important;
                    break-after: page !important;
                }

                .shipping-print-page:last-child {
                    page-break-after: auto !important;
                    break-after: auto !important;
                }

                .shipping-label {
                    margin: 0 auto !important;
                }
            }
        `
    });

    const getContainerClass = () => {
        if (labelSize === "3x5") return "label-3x5";
        if (labelSize === "3x6") return "label-3x6";
        return "label-3x3";
    };

    const formatDate = (isoString) => {
        if (!isoString) return "";

        const date = new Date(isoString);

        return `${String(date.getDate()).padStart(2, "0")}.${String(
            date.getMonth() + 1
        ).padStart(2, "0")}.${date.getFullYear()}`;
    };

    const getAwb = (order) => {
        return order?._id?.slice(-16)?.toUpperCase() || "";
    };

    const getStatusText = (order) => {
        return order?.status === "paid"
            ? "Prepaid: Do not collect cash"
            : "COD: Collect Cash";
    };

    const getQrValue = (order) => {
        return `AWB:${order?._id || ""}|PIN:${order?.address?.pincode || ""}`;
    };

    const getAddressLines = (order) => {
        const address = order?.address || {};

        return [
            address?.city,
            address?.state,
            address?.pincode ? `PIN: ${address.pincode}` : null,
            address?.phone ? `Ph: ${address.phone}` : null
        ].filter(Boolean);
    };

    const getItemDiscount = (item) => {
        if (item?.discountAmount !== undefined && item?.discountAmount !== null) {
            return Number(item.discountAmount || 0);
        }

        const discount = item?.discount;

        if (!discount?.enabled) return 0;

        const subtotal =
            Number(item?.price || 0) *
            Number(item?.quantity || 0);

        const type = String(
            discount?.type ||
            discount?.discountType ||
            "percentage"
        ).toLowerCase();

        const value = Number(
            discount?.value ??
            discount?.amount ??
            discount?.percentage ??
            discount?.rate ??
            0
        );

        if (type === "flat" || type === "fixed") {
            return Math.min(value, subtotal);
        }

        return Math.min(subtotal, (subtotal * value) / 100);
    };

    const getItemGst = (item) => {
        if (item?.gstAmount !== undefined && item?.gstAmount !== null) {
            return Number(item.gstAmount || 0);
        }

        const gst = item?.gst;

        if (!gst?.enabled) return 0;

        const subtotal =
            Number(item?.price || 0) *
            Number(item?.quantity || 0);

        const discount = getItemDiscount(item);
        const taxableAmount = Math.max(0, subtotal - discount);

        const rate = Number(
            gst?.rate ??
            gst?.percentage ??
            gst?.value ??
            gst?.gstRate ??
            0
        );

        return (taxableAmount * rate) / 100;
    };

    const getItemShipping = (item) => {
        if (item?.shippingAmount !== undefined && item?.shippingAmount !== null) {
            return Number(item.shippingAmount || 0);
        }

        return item?.shipping?.enabled
            ? Number(item?.shipping?.charge || 0)
            : 0;
    };

    const getItemTotal = (item) => {
        const subtotal =
            Number(item?.price || 0) *
            Number(item?.quantity || 0);

        const discount = getItemDiscount(item);
        const gst = getItemGst(item);
        const shipping = getItemShipping(item);

        return Math.max(0, subtotal - discount + gst + shipping);
    };

    const formatAmount = (amount) => {
        return Number(amount || 0).toFixed(2);
    };

    const ShippingLabel = ({ order, preview = false }) => {
        const isPrepaid = order?.status === "paid";
        const awb = getAwb(order);
        const items = Array.isArray(order?.items) ? order.items : [];

        const totalQty = items.reduce(
            (sum, item) => sum + Number(item?.quantity || 0),
            0
        );

        const itemDiscountTotal = items.reduce(
            (sum, item) => sum + getItemDiscount(item),
            0
        );

        const itemGstTotal = items.reduce(
            (sum, item) => sum + getItemGst(item),
            0
        );

        const itemShippingTotal = items.reduce(
            (sum, item) => sum + getItemShipping(item),
            0
        );

        const discountAmount =
            order?.discountAmount !== undefined &&
                order?.discountAmount !== null
                ? Number(order.discountAmount || 0)
                : itemDiscountTotal;

        const gstAmount =
            order?.gstAmount !== undefined &&
                order?.gstAmount !== null
                ? Number(order.gstAmount || 0)
                : itemGstTotal;

        const shippingAmount =
            order?.shippingAmount !== undefined &&
                order?.shippingAmount !== null
                ? Number(order.shippingAmount || 0)
                : itemShippingTotal;

        const totalAmount =
            order?.totalAmount !== undefined &&
                order?.totalAmount !== null
                ? Number(order.totalAmount || 0)
                : items.reduce(
                    (sum, item) => sum + getItemTotal(item),
                    0
                );

        return (
            <div
                className={`shipping-label ${getContainerClass()} ${items.length > 3 ? "many-products" : ""
                    } ${preview ? "preview-label" : ""}`}
            >
                <div className="label-content">
                    <div className="top-section">
                        <div className="customer-section">
                            <div className="section-title">
                                Customer Address
                            </div>

                            <div className="customer-name">
                                {order?.address?.name || ""}
                            </div>

                            {getAddressLines(order).map((line, index) => (
                                <div
                                    key={`${line}-${index}`}
                                    className={
                                        line.startsWith("PIN:")
                                            ? "pin-line"
                                            : "address-line"
                                    }
                                >
                                    {line}
                                </div>
                            ))}

                            <div className="return-block">
                                <div className="return-title">
                                    Delivered, return to
                                </div>
                                <div>Developer Logistics</div>
                                <div>Jaipur, Rajasthan, 302001</div>
                            </div>
                        </div>

                        <div className="carrier-section">
                            <div className="carrier-top">
                                <div className="carrier-info">
                                    <div className="carrier-name">
                                        Delhivery
                                    </div>

                                    <div className="carrier-tag">
                                        {isPrepaid ? "PREPAID" : "COD"}
                                    </div>

                                    <div className="destination-block">
                                        <div className="small-label">
                                            Destination Code
                                        </div>

                                        <div className="destination-value">
                                            {order?.address?.pincode || ""}
                                        </div>

                                        <div className="small-label">
                                            Return Code
                                        </div>

                                        <div className="return-code">
                                            Jaipur_Rajasthan
                                        </div>
                                    </div>
                                </div>

                                <div className="qr-box">
                                    <QRCodeSVG
                                        value={getQrValue(order)}
                                        size={labelSize === "3x3" ? 40 : 48}
                                        level="M"
                                        includeMargin={false}
                                    />
                                </div>
                            </div>

                            <div className="awb-block">
                                <div className="awb-number">{awb}</div>

                                <Barcode
                                    value={awb || "0"}
                                    format="CODE128"
                                    width={labelSize === "3x3" ? 0.75 : 0.9}
                                    height={labelSize === "3x3" ? 19 : 24}
                                    fontSize={labelSize === "3x3" ? 5 : 5.5}
                                    font="Arial"
                                    displayValue={true}
                                    background="#ffffff"
                                    lineColor="#000000"
                                    margin={0}
                                    textMargin={1}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="product-section">
                        <div className="product-table product-header">
                            <div>PRODUCT</div>
                            <div className="center">QTY</div>
                            <div className="right">PRICE</div>
                        </div>

                        {items.map((item, index) => (
                            <div
                                key={item?._id || item?.productId || index}
                                className="product-table product-row"
                            >
                                <div className="product-name">
                                    {item?.productTitle || ""}
                                </div>

                                <div className="center">
                                    {Number(item?.quantity || 0)}
                                </div>

                                <div className="right">
                                    ₹{formatAmount(item?.price)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="invoice-section">
                        <div className="invoice-heading">
                            <span>TAX INVOICE</span>
                            <span>Original For Recipient</span>
                        </div>

                        <div className="invoice-meta">
                            <div>
                                <div>
                                    <span>Order No.:</span>{" "}
                                    {order?.orderId || ""}
                                </div>

                                <div>
                                    <span>Order Date:</span>{" "}
                                    {formatDate(order?.createdAt)}
                                </div>
                            </div>

                            <div>
                                <div>
                                    <span>Seller:</span> Developer
                                </div>

                                <div>
                                    <span>GSTIN:</span>{" "}
                                    {order?.gstin || "08AADCXXXXX1Z0"}
                                </div>
                            </div>
                        </div>

                        <div className="order-summary">

                            <div className="summary-grid">
                                <div>
                                    <span>DISCOUNT</span>
                                    <strong>
                                        ₹{formatAmount(discountAmount)}
                                    </strong>
                                </div>

                                <div>
                                    <span>GST</span>
                                    <strong>
                                        ₹{formatAmount(gstAmount)}
                                    </strong>
                                </div>

                                <div>
                                    <span>SHIPPING</span>
                                    <strong>
                                        ₹{formatAmount(shippingAmount)}
                                    </strong>
                                </div>

                                <div>
                                    <span>QTY</span>
                                    <strong>{totalQty}</strong>
                                </div>

                                <div className="summary-total">
                                    <span>TOTAL</span>
                                    <strong>
                                        ₹{formatAmount(totalAmount)}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (!selectedOrders || selectedOrders.length === 0) {
        return (
            <div className="text-white text-center mt-20">
                <h2 className="text-2xl font-bold text-yellow-400">
                    No Orders Selected
                </h2>

                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 bg-yellow-400 text-black font-bold rounded"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="labels-page p-6 min-h-screen bg-black">
            <style>{`
                .shipping-label {
                    box-sizing: border-box;
                    width: 3in;
                    background: #fff;
                    color: #000;
                    overflow: visible;
                    margin: 0 auto;
                    padding: 4px;
                    font-family: Arial, Helvetica, sans-serif;
                    font-weight: 400;
                    line-height: 1.05;
                }

                .label-content {
                    width: 100%;
                    box-sizing: border-box;
                    border: 0.5px solid #888;
                    overflow: hidden;
                }

                .label-3x3 {
                    min-height: 3in;
                    font-size: 6.5px;
                }

                .label-3x5 {
                    min-height: 5in;
                    font-size: 7px;
                }

                .label-3x6 {
                    min-height: 6in;
                    font-size: 7px;
                }

                .top-section {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    border-bottom: 0.5px solid #999;
                }

                .customer-section {
                    min-width: 0;
                    padding: 3px;
                    border-right: 0.5px solid #999;
                }

                .carrier-section {
                    min-width: 0;
                    padding: 3px;
                }

                .section-title {
                    margin: 0 0 2px;
                    font-size: 6.5px;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .customer-name {
                    margin: 0 0 1px;
                    font-size: 7px;
                    font-weight: 700;
                }

                .address-line,
                .pin-line {
                    margin: 0;
                    font-size: 6.5px;
                    line-height: 1.05;
                }

                .pin-line {
                    font-weight: 700;
                }

                .return-block {
                    margin-top: 3px;
                    padding-top: 2px;
                    border-top: 0.5px solid #777;
                    font-size: 6px;
                    line-height: 1.05;
                }

                .return-title {
                    margin: 0 0 1px;
                    font-size: 6.5px;
                    font-weight: 700;
                }

                .carrier-top {
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) 44px;
                    gap: 2px;
                    align-items: start;
                }

                .carrier-info {
                    min-width: 0;
                }

                .carrier-name {
                    margin: 0 0 2px;
                    font-size: 11px;
                    font-weight: 600;
                    line-height: 1;
                    white-space: nowrap;
                }

                .carrier-tag {
                    display: inline-block;
                    padding: 1px 4px;
                    border: 0.5px solid #888;
                    font-size: 5.5px;
                    line-height: 1;
                }

                .qr-box {
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: flex-start;
                    justify-content: flex-end;
                }

                .destination-block {
                    margin-top: 3px;
                }

                .small-label {
                    margin: 0;
                    font-size: 5.5px;
                    line-height: 1;
                }

                .destination-value {
                    margin: 1px 0 2px;
                    font-size: 7px;
                    font-weight: 700;
                    line-height: 1;
                }

                .return-code {
                    margin: 0;
                    font-size: 5.5px;
                    line-height: 1;
                }

                .awb-block {
                    margin-top: 2px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    overflow: hidden;
                }

                .awb-number {
                    margin: 0 0 1px;
                    font-size: 7px;
                    font-weight: 700;
                    line-height: 1;
                    text-align: center;
                    word-break: break-all;
                }

                .awb-block svg {
                    display: block;
                    width: auto;
                    max-width: 100%;
                    height: auto;
                }

                .product-section {
                    padding: 2px 3px;
                    border-bottom: 0.5px solid #999;
                }

                .product-table {
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) 28px 52px;
                    gap: 1px;
                    align-items: center;
                }

                .product-header {
                    padding: 0 0 1px;
                    border-bottom: 0.5px solid #aaa;
                    font-size: 5.8px;
                    font-weight: 700;
                }

                .product-row {
                    min-height: 13px;
                    font-size: 6.2px;
                }

                .product-name {
                    min-width: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .center {
                    text-align: center;
                }

                .right {
                    text-align: right;
                }

                .invoice-section {
                    border-bottom: 0;
                }

                .invoice-heading {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 4px;
                    padding: 3px 5px;
                    border-bottom: 0.5px solid #999;
                    font-size: 7px;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .invoice-heading span:last-child {
                    font-size: 6px;
                    font-weight: 400;
                    text-transform: none;
                }

                .invoice-meta {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 3px;
                    padding: 3px 5px;
                    border-bottom: 0.5px solid #999;
                    font-size: 6px;
                    line-height: 1.1;
                    overflow-wrap: anywhere;
                }

                .invoice-meta span {
                    font-weight: 700;
                }

                .order-summary {
                    border-bottom: 0;
                }

                .summary-title {
                    padding: 2px 5px;
                    border-bottom: 0.5px solid #999;
                    font-size: 6.5px;
                    font-weight: 700;
                }

                .summary-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1.15fr 0.65fr 1.05fr;
                }

                .summary-grid > div {
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 2px 4px;
                    border: 0;
                }

                .summary-grid span {
                    font-size: 5.8px;
                    line-height: 1;
                    font-weight: 700;
                }

                .summary-grid strong {
                    margin-top: 1px;
                    font-size: 6.5px;
                    line-height: 1;
                }

                .summary-total {
                    font-weight: 700;
                }

                .label-3x3 .customer-section,
                .label-3x3 .carrier-section {
                    padding: 2px;
                }

                .label-3x3 .section-title {
                    margin-bottom: 1px;
                    font-size: 5.8px;
                }

                .label-3x3 .customer-name {
                    font-size: 6.2px;
                }

                .label-3x3 .address-line,
                .label-3x3 .pin-line {
                    font-size: 5.9px;
                }

                .label-3x3 .return-block {
                    margin-top: 3px;
                    padding-top: 2px;
                    font-size: 5.5px;
                }

                .label-3x3 .return-title {
                    font-size: 5.9px;
                }

                .label-3x3 .carrier-top {
                    grid-template-columns: minmax(0, 1fr) 40px;
                }

                .label-3x3 .carrier-name {
                    font-size: 10px;
                }

                .label-3x3 .qr-box {
                    width: 40px;
                    height: 40px;
                }

                .label-3x3 .small-label,
                .label-3x3 .return-code {
                    font-size: 5px;
                }

                .label-3x3 .destination-value {
                    margin: 1px 0;
                    font-size: 6.2px;
                }

                .label-3x3 .awb-number {
                    font-size: 6.2px;
                }

                .label-3x3 .product-section {
                    padding: 2px;
                }

                .label-3x3 .product-table {
                    grid-template-columns: minmax(0, 1fr) 20px 38px;
                    gap: 1px;
                }

                .label-3x3 .product-header {
                    padding-bottom: 1px;
                    font-size: 4.9px;
                }

                .label-3x3 .product-row {
                    min-height: 11px;
                    font-size: 5.3px;
                }

                .label-3x3 .invoice-heading {
                    padding: 2px 3px;
                    font-size: 5.8px;
                }

                .label-3x3 .invoice-heading span:last-child {
                    font-size: 5px;
                }

                .label-3x3 .invoice-meta {
                    padding: 2px 3px;
                    font-size: 5.2px;
                    gap: 2px;
                }

                .label-3x3 .summary-title {
                    padding: 2px 3px;
                    font-size: 5.5px;
                }

                .label-3x3 .summary-grid {
                    grid-template-columns: 1fr 1fr 1fr 26px 1.2fr;
                }

                .label-3x3 .summary-grid > div {
                    padding: 2px;
                }

                .label-3x3 .summary-grid span {
                    font-size: 4.7px;
                }

                .label-3x3 .summary-grid strong {
                    font-size: 5.5px;
                }

                .label-3x3 .summary-total strong {
                    font-size: 6.2px;
                }

                .many-products .product-row {
                    min-height: 10px;
                }

                .many-products .product-section {
                    padding-top: 2px;
                    padding-bottom: 2px;
                }

                .label-3x3.many-products .product-row {
                    min-height: 9px;
                    font-size: 5px;
                }

                .label-3x3.many-products .product-header {
                    font-size: 4.6px;
                }

                .label-3x5 .product-row {
                    min-height: 13px;
                }

                .label-3x6 .product-row {
                    min-height: 14px;
                }

                .label-3x5 .invoice-heading,
                .label-3x6 .invoice-heading {
                    padding: 3px 5px;
                }

                .label-3x5 .invoice-meta,
                .label-3x6 .invoice-meta {
                    padding: 3px 5px;
                }

                .preview-label {
                    margin: 0 !important;
                    flex-shrink: 0;
                }

                .print-only-labels {
                    position: absolute;
                    left: -99999px;
                    top: 0;
                }

                .shipping-print-page {
                    width: 3in;
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                @media print {
                    .labels-page {
                        padding: 0 !important;
                        margin: 0 !important;
                        background: #fff !important;
                    }

                    .print-only-labels {
                        position: static !important;
                        left: auto !important;
                        top: auto !important;
                    }

                    .shipping-print-page {
                        width: 3in !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        box-sizing: border-box !important;
                        page-break-after: always !important;
                        break-after: page !important;
                    }

                    .shipping-print-page:last-child {
                        page-break-after: auto !important;
                        break-after: auto !important;
                    }

                    .label-3x3 {
                        width: 3in !important;
                        min-height: 3in !important;
                    }

                    .label-3x5 {
                        width: 3in !important;
                        min-height: 5in !important;
                    }

                    .label-3x6 {
                        width: 3in !important;
                        min-height: 6in !important;
                    }

                    .label-content {
                        width: 100% !important;
                    }
                }

                @media screen and (max-width: 767px) {
                    .labels-page {
                        padding: 12px !important;
                    }
                }
            `}</style>

            <div className="flex flex-col md:flex-row justify-between items-center bg-gray-900 p-4 rounded-lg border border-yellow-500/30 mb-8 gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>

                    <h1 className="text-xl font-bold text-yellow-400">
                        Label Generator
                    </h1>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <select
                        value={labelSize}
                        onChange={(e) => setLabelSize(e.target.value)}
                        className="bg-black text-yellow-400 border border-yellow-400/50 rounded-lg px-4 py-2 outline-none cursor-pointer"
                    >
                        <option value="3x3">
                            3x3 In (Shipping Only)
                        </option>

                        <option value="3x5">
                            3x5 In (Label + Invoice)
                        </option>

                        <option value="3x6">
                            3x6 In (Full Detail)
                        </option>
                    </select>

                    <button
                        onClick={handlePrint}
                        disabled={isPending || !labelsData?.data}
                        className="flex items-center gap-2 bg-yellow-400 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-500 disabled:opacity-50 transition-colors"
                    >
                        <Printer size={20} />
                        {isPending ? "Loading..." : "Print Labels"}
                    </button>
                </div>
            </div>

            <div
                ref={printRef}
                className="print-only-labels"
                aria-hidden="true"
            >
                {labelsData?.data?.map((order) => (
                    <div
                        key={order._id}
                        className="shipping-print-page"
                    >
                        <ShippingLabel order={order} />
                    </div>
                ))}
            </div>

            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                    Label Preview (Grid)
                </h2>

                <div className="text-sm text-gray-400">
                    Format:{" "}
                    <span className="text-yellow-400 font-semibold">
                        {labelSize}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {labelsData?.data?.map((order) => {
                    const isPrepaid = order?.status === "paid";

                    return (
                        <div
                            key={order._id}
                            className="bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-lg"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <div className="text-sm text-gray-300">
                                        {order?.address?.name || ""}
                                    </div>

                                    <div className="text-xs text-gray-500 mt-0.5">
                                        {order?.address?.city || ""},{" "}
                                        {order?.address?.state || ""}
                                    </div>
                                </div>

                                <span
                                    className={`px-2.5 py-1 rounded text-[10px] ${isPrepaid
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-red-500/20 text-red-400"
                                        }`}
                                >
                                    {isPrepaid ? "PREPAID" : "COD"}
                                </span>
                            </div>

                            <div className="bg-gray-200 rounded-lg p-3 flex justify-center overflow-hidden">
                                <ShippingLabel
                                    order={order}
                                    preview={true}
                                />
                            </div>

                            <div className="mt-3 flex justify-between text-xs text-gray-500">
                                <span>
                                    Order: {getAwb(order)}
                                </span>

                                <span>{labelSize}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LabelsPage;
