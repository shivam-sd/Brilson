import React, { useEffect, useMemo, useState } from "react";
import {
    FiArrowUpRight,
    FiCheck,
    FiEdit3,
    FiLayers,
    FiMinus,
    FiRefreshCw,
    FiSave,
    FiTrendingUp,
    FiUsers,
} from "react-icons/fi";

import { TfiWallet } from "react-icons/tfi";

import {
    useGetReferralCommissions,
    useUpdateReferralCommission,
} from "../api/referralCommission";


const ReferralCommission = () => {

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useGetReferralCommissions();

    const updateCommission = useUpdateReferralCommission();

    const [amounts, setAmounts] = useState({});
    const [editingLevel, setEditingLevel] = useState(null);



    const commissions = data?.data || [];


    useEffect(() => {
        if (commissions.length > 0) {

            const initialAmounts = {};

            commissions.forEach((item) => {
                initialAmounts[item.level] = item.amount;
            });

            setAmounts(initialAmounts);
        }
    }, [data]);



    const totalCommission = useMemo(() => {
        return commissions.reduce(
            (total, item) =>
                total + Number(item.amount || 0),
            0
        );
    }, [commissions]);



    const highestCommission = useMemo(() => {

        if (!commissions.length) return 0;

        return Math.max(
            ...commissions.map((item) =>
                Number(item.amount || 0)
            )
        );

    }, [commissions]);



    const handleAmountChange = (level, value) => {

        setAmounts((prev) => ({
            ...prev,
            [level]: value,
        }));

    };



    const handleUpdate = async (level) => {

        const amount = amounts[level];

        if (
            amount === "" ||
            amount === undefined ||
            Number(amount) < 0
        ) {
            return;
        }

        setEditingLevel(level);

        try {

            await updateCommission.mutateAsync({
                level,
                amount: Number(amount),
            });

        } finally {

            setEditingLevel(null);

        }
    };



    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#fdfcfb] via-[#f5f3ff] to-[#fef3e7] p-4 md:p-6 lg:p-8">

                <div className="max-w-7xl mx-auto">

                    <div className="animate-pulse">

                        <div className="h-10 bg-white/60 rounded-xl w-72 mb-3" />

                        <div className="h-5 bg-white/60 rounded-lg w-96 mb-8" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="h-32 bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-sm"
                                />
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {[1, 2, 3, 4, 5, 6, 7].map(
                                (item) => (
                                    <div
                                        key={item}
                                        className="h-56 bg-white/70 backdrop-blur rounded-2xl border border-white/60 shadow-sm"
                                    />
                                )
                            )}

                        </div>

                    </div>

                </div>

            </div>
        );
    }



    if (isError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#fdfcfb] via-[#f5f3ff] to-[#fef3e7] p-6">

                <div className="max-w-xl mx-auto mt-20">

                    <div className="bg-white/90 backdrop-blur border border-red-100 rounded-3xl p-10 text-center shadow-xl shadow-red-100/20">

                        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center mb-5">

                            <FiRefreshCw
                                className="text-red-500"
                                size={24}
                            />

                        </div>

                        <h2 className="text-xl font-bold text-stone-900">
                            Unable to load commissions
                        </h2>

                        <p className="text-sm text-stone-500 mt-2 mb-7 max-w-sm mx-auto leading-relaxed">
                            Something went wrong while fetching
                            referral commission settings. Please try again.
                        </p>

                        <button
                            onClick={() => refetch()}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 text-white text-sm font-semibold hover:bg-amber-600 shadow-md transition-all duration-200"
                        >
                            <FiRefreshCw size={16} />
                            Try Again
                        </button>

                    </div>

                </div>

            </div>
        );
    }


    return (
        <div className="min-h-screen rounded-2xl bg-gradient-to-br from-gray-300 via-[#f5f3ff] to-gray-500 font-Roboto cursor-pointer">

            <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-10 lg:px-8">



                {/* HEADER */}

                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-10">

                    <div>

                        <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 bg-white/70 backdrop-blur border border-amber-200/70 px-3 py-1.5 rounded-full mb-4 tracking-wide shadow-sm">

                            <FiLayers size={14} />

                            <span>Admin settings</span>

                        </div>

                        <h3 className="text-4xl md:text-5xl font-extrabold tracking-wide text-stone-900 font-Roboto">
                            Referral Commission
                        </h3>

                        <p className="lg:mt-2 mt-3 text-stone-500 max-w-2xl leading-relaxed">
                            Set the reward amount paid out to users
                            for each referral level in the chain.
                        </p>

                    </div>



                </div>



                {/* STATS CARDS */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">


                    {/* Total Levels */}

                    <div className="relative overflow-hidden bg-white/85 backdrop-blur rounded-3xl border border-white/80 p-6 shadow-lg shadow-stone-200/30">

                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-100/60 rounded-full blur-xl" />

                        <div className="relative flex items-start justify-between">

                            <div>

                                <p className="text-sm font-medium text-stone-500">
                                    Active levels
                                </p>

                                <h3 className="text-4xl font-extrabold text-stone-900 mt-2 tracking-tight">
                                    {commissions.length}
                                </h3>

                                <p className="text-xs text-stone-400 mt-2">
                                    Referral levels configured
                                </p>

                            </div>

                            <div className="w-12 h-12 rounded-2xl bg-stone-900 text-amber-300 flex items-center justify-center shadow-md shrink-0">

                                <FiLayers size={22} />

                            </div>

                        </div>

                    </div>



                    {/* Total Payout */}

                    <div className="relative overflow-hidden bg-white/85 backdrop-blur rounded-3xl border border-white/80 p-6 shadow-lg shadow-stone-200/30">

                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-100/60 rounded-full blur-xl" />

                        <div className="relative flex items-start justify-between">

                            <div>

                                <p className="text-sm font-medium text-stone-500">
                                    Total level payout
                                </p>

                                <h3 className="text-4xl font-extrabold text-stone-900 mt-2 tracking-tight">
                                    ₹{totalCommission}
                                </h3>

                                <p className="text-xs text-stone-400 mt-2">
                                    Combined configured amount
                                </p>

                            </div>

                            <div className="w-12 h-12 rounded-2xl bg-stone-900 text-emerald-300 flex items-center justify-center shadow-md shrink-0">

                                <TfiWallet size={22} />

                            </div>

                        </div>

                    </div>



                    {/* Highest */}

                    <div className="relative overflow-hidden bg-white/85 backdrop-blur rounded-3xl border border-white/80 p-6 shadow-lg shadow-stone-200/30 sm:col-span-2 lg:col-span-1">

                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-violet-100/60 rounded-full blur-xl" />

                        <div className="relative flex items-start justify-between">

                            <div>

                                <p className="text-sm font-medium text-stone-500">
                                    Highest reward
                                </p>

                                <h3 className="text-4xl font-extrabold text-stone-900 mt-2 tracking-tight">
                                    ₹{highestCommission}
                                </h3>

                                <p className="text-xs text-stone-400 mt-2">
                                    Highest amount per level
                                </p>

                            </div>

                            <div className="w-12 h-12 rounded-2xl bg-stone-900 text-violet-300 flex items-center justify-center shadow-md shrink-0">

                                <FiTrendingUp size={22} />

                            </div>

                        </div>

                    </div>

                </div>



                {/* MAIN PANEL */}

                <div className="bg-white/90 backdrop-blur border border-white/80 rounded-3xl shadow-xl shadow-stone-200/40 overflow-hidden">


                    {/* Panel Header */}

                    <div className="px-6 py-6 md:px-7 border-b border-stone-100 bg-gradient-to-r from-white/60 via-amber-50/40 to-violet-50/40">

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                            <div>

                                <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                                    Level-wise commission
                                </h2>

                                <p className="text-sm text-stone-500 mt-1.5">
                                    Update the reward amount for each referral level.
                                </p>

                            </div>


                            <div className="inline-flex items-center gap-2 self-start px-3.5 py-2 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-xs font-bold">

                                <span className="relative flex h-2 w-2">

                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>

                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>

                                </span>

                                Commission system active

                            </div>

                        </div>

                    </div>



                    {/* Cards Grid */}

                    <div className="p-6 md:p-7 bg-gradient-to-br from-[#fdfcfb]/70 via-[#faf8ff]/70 to-[#fef8f2]/70">

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                            {commissions.map((item) => {

                                const currentAmount =
                                    amounts[item.level] ?? item.amount;

                                const hasChanged =
                                    String(currentAmount) !==
                                    String(item.amount);

                                const isUpdating =
                                    editingLevel === item.level &&
                                    updateCommission.isPending;

                                const numericCurrent = Number(currentAmount) || 0;
                                const numericSaved = Number(item.amount) || 0;
                                const diff = numericCurrent - numericSaved;

                                const barWidth = highestCommission > 0
                                    ? Math.min(
                                        100,
                                        Math.round((numericCurrent / highestCommission) * 100)
                                    )
                                    : 0;


                                return (
                                    <div
                                        key={item._id}
                                        className={`group relative rounded-2xl border p-5 transition-colors duration-200 ${
                                            hasChanged
                                                ? "border-amber-300 bg-amber-50/80 shadow-lg shadow-amber-100/50"
                                                : "border-white/80 bg-white/85 backdrop-blur shadow-md shadow-stone-200/30"
                                        }`}
                                    >


                                        {/* Top */}

                                        <div className="flex items-center justify-between mb-4">

                                            <div className="flex items-center gap-3">

                                                <div className="w-11 h-11 rounded-xl bg-stone-900 text-amber-300 flex items-center justify-center font-bold text-sm shadow-md shadow-stone-900/20 shrink-0">
                                                    L{item.level}
                                                </div>

                                                <div>

                                                    <h3 className="font-bold text-stone-900">
                                                        Level {item.level}
                                                    </h3>

                                                    <p className="text-xs text-stone-500">
                                                        Referral reward
                                                    </p>

                                                </div>

                                            </div>


                                            {hasChanged ? (
                                                <span className="text-[11px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-full">
                                                    Unsaved
                                                </span>
                                            ) : (
                                                <div className="w-8 h-8 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-400">
                                                    <FiEdit3 size={15} />
                                                </div>
                                            )}

                                        </div>


                                        {/* Relative scale bar */}

                                        <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden mb-4">
                                            <div
                                                className={`h-full rounded-full transition-all duration-300 ${
                                                    hasChanged ? "bg-amber-500" : "bg-stone-900"
                                                }`}
                                                style={{ width: `${barWidth}%` }}
                                            />
                                        </div>



                                        {/* Amount */}

                                        <div className="mb-4">

                                            <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                                                Commission amount
                                            </label>


                                            <div className="relative mt-2">

                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-stone-400">
                                                    ₹
                                                </span>

                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={currentAmount}
                                                    onChange={(e) =>
                                                        handleAmountChange(
                                                            item.level,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full h-14 rounded-xl border border-stone-200 bg-white pl-10 pr-4 text-xl font-bold text-stone-900 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100/60 transition-colors duration-200"
                                                />

                                            </div>

                                        </div>



                                        {/* Save Button */}

                                        <button
                                            onClick={() =>
                                                handleUpdate(item.level)
                                            }
                                            disabled={
                                                isUpdating ||
                                                !hasChanged
                                            }
                                            className={`w-full h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-colors duration-200 cursor-pointer ${
                                                hasChanged
                                                    ? "bg-stone-900 text-amber-300 hover:bg-amber-600 hover:text-white shadow-md shadow-stone-300/50"
                                                    : "bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200/60"
                                            }`}
                                        >

                                            {isUpdating ? (
                                                <>
                                                    <FiRefreshCw
                                                        size={16}
                                                        className="animate-spin"
                                                    />
                                                    Saving...
                                                </>
                                            ) : hasChanged ? (
                                                <>
                                                    <FiSave size={16} />
                                                    Save changes
                                                </>
                                            ) : (
                                                <>
                                                    <FiCheck size={16} />
                                                    Saved
                                                </>
                                            )}

                                        </button>


                                        {/* Current value indicator */}

                                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">

                                            <span className="text-xs text-stone-400 font-medium">
                                                Current reward
                                            </span>

                                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md">
                                                ₹{item.amount}
                                                {hasChanged && (
                                                    <span
                                                        className={`inline-flex items-center gap-0.5 ${
                                                            diff > 0
                                                                ? "text-emerald-600"
                                                                : diff < 0
                                                                ? "text-red-500"
                                                                : "text-stone-400"
                                                        }`}
                                                    >
                                                        {diff === 0 ? (
                                                            <FiMinus size={11} />
                                                        ) : (
                                                            <FiArrowUpRight
                                                                size={11}
                                                                className={diff < 0 ? "rotate-90" : ""}
                                                            />
                                                        )}
                                                        {diff > 0 ? `+₹${diff}` : diff < 0 ? `-₹${Math.abs(diff)}` : ""}
                                                    </span>
                                                )}
                                            </span>

                                        </div>

                                    </div>
                                );

                            })}

                        </div>

                    </div>



                    {/* Panel Footer */}

                    <div className="px-6 py-4 md:px-7 border-t border-stone-100 bg-gradient-to-r from-white/60 via-amber-50/30 to-violet-50/30">

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">


                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ReferralCommission;
