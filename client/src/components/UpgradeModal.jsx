import React, { useState } from 'react';
import { X, Zap, CheckCircle, Loader2 } from 'lucide-react';
import { API_URL } from '../lib/config';

export default function UpgradeModal({ isOpen, onClose }) {
    const [loadingPlan, setLoadingPlan] = useState(null);

    if (!isOpen) return null;

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleUpgrade = async (planTier) => {
        setLoadingPlan(planTier);
        try {
            const res = await loadRazorpay();
            if (!res) {
                alert('Razorpay SDK failed to load. Are you offline?');
                setLoadingPlan(null);
                return;
            }

            const token = localStorage.getItem('token');
            // Create Order
            const orderRes = await fetch(`${API_URL}/payment/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ planTier })
            });

            const orderData = await orderRes.json();
            if (!orderRes.ok) throw new Error(orderData.error);

            const options = {
                key: orderData.key_id,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'WhatDoc.xyz',
                description: `Upgrade to ${planTier === '499' ? 'Starter' : 'Pro'} Plan`,
                order_id: orderData.id,
                handler: async function (response) {
                    // Verify Payment
                    const verifyRes = await fetch(`${API_URL}/payment/verify`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            planTier
                        })
                    });
                    const verifyData = await verifyRes.json();
                    if (verifyData.success) {
                        alert('Payment Successful! You are now a Pro user.');
                        window.location.reload(); // Refresh to apply changes
                    } else {
                        alert('Payment verification failed.');
                    }
                },
                prefill: {
                    name: '',
                    email: '',
                    contact: ''
                },
                theme: {
                    color: '#10b981' // emerald-500
                }
            };

            const paymentObject = new window.Razorpay(options);

            paymentObject.on('payment.failed', function (response) {
                alert(response.error.description);
                setLoadingPlan(null);
            });

            paymentObject.open();

        } catch (err) {
            console.error(err);
            alert('Something went wrong during payment initialization.');
            setLoadingPlan(null);
        }
    };

    const features = [
        "Unlimited AI Generations",
        "Custom Domain Support",
        "Premium Templates",
        "Priority Support",
        "API Access (Coming Soon)"
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
            <div className="relative w-full max-w-4xl bg-[#030303] border border-white/[0.08] rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col items-center overflow-hidden">

                {/* Background Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-emerald-500/20 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 blur-[120px] pointer-events-none rounded-full" />
                <div className="absolute top-1/2 right-0 w-64 h-64 bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-zinc-500 hover:text-white hover:rotate-90 hover:bg-white/5 p-2 rounded-full transition-all duration-300 z-50"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="text-center w-full px-8 pt-12 pb-8 relative z-10 border-b border-white/[0.05] bg-gradient-to-b from-[#0a0a0a] to-transparent">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.15)] border border-emerald-500/20 relative">
                        <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full" />
                        <Zap className="text-emerald-400 size-7 relative z-10" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500 tracking-tight">
                        Unleash your docs.
                    </h2>
                    <p className="text-zinc-400 mt-4 text-sm md:text-base max-w-lg mx-auto font-medium">
                        Go beyond the free tier. Generate limitless, beautiful documentation without friction.
                    </p>
                </div>

                {/* Content Body */}
                <div className="w-full flex flex-col md:flex-row p-6 md:p-8 gap-8 md:gap-12 relative z-10">


                    <div className="flex-1 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/5 pb-8 md:pb-0 md:pr-8">
                        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-6">Everything you get</h3>
                        <div className="flex flex-col gap-4">
                            {features.map((feat, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-sm md:text-base text-zinc-300 group">
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                                        <CheckCircle className="size-3.5 text-emerald-400" />
                                    </div>
                                    <span className="group-hover:text-white transition-colors">{feat}</span>
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="flex-[1.5] grid md:grid-cols-2 gap-4 md:gap-5">

                        {/* Starter Plan */}
                        <div className="group relative p-6 rounded-2xl border border-white/[0.08] bg-zinc-900/40 hover:bg-zinc-900/60 flex flex-col justify-between transition-all duration-300 hover:border-zinc-700 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-white">Starter Pass</h3>
                                <p className="text-zinc-500 text-xs font-medium mt-1 uppercase tracking-wider">For indies</p>
                                <div className="mt-6">
                                    <div className="flex items-baseline text-white">
                                        <span className="text-3xl font-black">₹499</span>
                                        <span className="text-sm text-zinc-500 ml-1 font-medium">/ 30 days</span>
                                    </div>
                                </div>
                                <ul className="mt-6 space-y-2 mb-8">
                                    <li className="text-sm text-zinc-400 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                                        Unlimited Generations
                                    </li>
                                    <li className="text-sm text-zinc-400 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                                        Max 10 Repositories
                                    </li>
                                </ul>
                            </div>
                            <button
                                onClick={() => handleUpgrade('499')}
                                disabled={loadingPlan !== null}
                                className="relative z-10 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition flex items-center justify-center gap-2 disabled:opacity-50 group-hover:border-white/20"
                            >
                                {loadingPlan === '499' ? <Loader2 className="animate-spin size-4" /> : 'Get Starter'}
                            </button>
                        </div>

                        {/* Pro Plan */}
                        <div className="group relative p-6 rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/40 to-zinc-900/60 flex flex-col justify-between transition-all duration-300 shadow-[0_0_40px_rgba(16,185,129,0.1)] hover:shadow-[0_0_50px_rgba(16,185,129,0.2)] overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400" />
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/20 blur-[50px] group-hover:bg-emerald-500/30 transition-colors" />

                            <div className="absolute top-4 right-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                Recommended
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-white">Pro Pass</h3>
                                <p className="text-emerald-500 font-medium text-xs mt-1 uppercase tracking-wider">For power users</p>
                                <div className="mt-6 flex items-baseline text-white">
                                    <span className="text-3xl font-black">₹999</span>
                                    <span className="text-sm text-zinc-500 ml-1 font-medium">/ 30 days</span>
                                </div>
                                <ul className="mt-6 space-y-2 mb-8">
                                    <li className="text-sm text-zinc-300 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
                                        Everything in Starter
                                    </li>
                                    <li className="text-sm text-zinc-300 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
                                        Max 25 Repositories
                                    </li>
                                </ul>
                            </div>
                            <button
                                onClick={() => handleUpgrade('999')}
                                disabled={loadingPlan !== null}
                                className="relative z-10 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50"
                            >
                                {loadingPlan === '999' ? <Loader2 className="animate-spin size-4" /> : 'Get Pro'}
                                {loadingPlan !== '999' && <Zap className="size-3.5 fill-white" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer text */}
                <div className="w-full text-center pb-6 pt-2 relative z-10">
                    <p className="text-xs text-zinc-600 font-medium">Secured by Razorpay. Cancel anytime.</p>
                </div>
            </div>
        </div>
    );
}
