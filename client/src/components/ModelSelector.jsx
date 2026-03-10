import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Lock, Zap, Check } from 'lucide-react';
export const models = [
    { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Lite', badge: 'Fast', isPremium: false, provider: 'gemini' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', badge: 'Balanced', isPremium: false, provider: 'gemini' },
    { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', badge: 'Smart', isPremium: false, provider: 'gemini' },
    { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', badge: 'Max Reasoning', isPremium: false, provider: 'gemini' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', badge: 'Balanced', isPremium: false, provider: 'openai' },
    { id: 'gpt-4o', name: 'GPT-4o', badge: 'Max Reasoning', isPremium: false, provider: 'openai' },
    { id: 'claude-3-5-haiku-latest', name: 'Claude 3.5 Haiku', badge: 'Balanced', isPremium: false, provider: 'anthropic' },
    { id: 'claude-3-7-sonnet-latest', name: 'Claude 3.7 Sonnet', badge: 'Max Reasoning', isPremium: false, provider: 'anthropic' }
];

export default function ModelSelector({ hasCustomKey, selectedModel, setSelectedModel, onRequestKey }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentModel = models.find(m => m.id === selectedModel) || models[0];
    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (model) => {
        setSelectedModel(model.id);
        setIsOpen(false);

        if (model.isPremium && !hasCustomKey) {
            onRequestKey(model);
        }
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-11 px-4 rounded-lg bg-[#111] border border-zinc-800 flex items-center justify-between text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-transparent transition-all hover:bg-zinc-900/80"
            >
                <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{currentModel.name}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase tracking-wider">
                        {currentModel.badge}
                    </span>
                </div>
                <ChevronDown className={`size-4 text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 p-1.5 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col gap-1">
                        {models.map((model) => {
                            const isLocked = model.isPremium && !hasCustomKey;
                            const isSelected = selectedModel === model.id;

                            return (
                                <button
                                    key={model.id}
                                    type="button"
                                    onClick={() => handleSelect(model)}
                                    className={`group relative flex items-center justify-between w-full p-3 rounded-lg text-left transition-all overflow-hidden
                                        ${isSelected ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-transparent border border-transparent hover:bg-white/5'}
                                        ${isLocked ? 'opacity-80' : ''}
                                    `}
                                >
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-semibold ${isSelected ? 'text-emerald-400' : isLocked ? 'text-zinc-400' : 'text-zinc-200'}`}>
                                                {model.name}
                                            </span>

                                            {/* Badge */}
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider
                                                ${isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}
                                            `}>
                                                {model.badge}
                                            </span>
                                        </div>
                                    </div>


                                    <div className="flex items-center gap-2">
                                        {/* Premium Logic */}
                                        {model.isPremium && (
                                            isLocked ? (
                                                <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-[10px] text-emerald-400/80 font-medium uppercase tracking-wider hidden sm:group-hover:block">Requires your API Key</span>
                                                    <Lock className="size-4 text-emerald-500" />
                                                </div>
                                            ) : (
                                                <Zap className={`size-4 ${isSelected ? 'text-emerald-400 fill-emerald-400/50' : 'text-zinc-500'}`} />
                                            )
                                        )}

                                        {/* Standard checkmark if selected (and not overridden by lock/zap logic) */}
                                        {isSelected && !model.isPremium && (
                                            <Check className="size-4 text-emerald-400" />
                                        )}
                                    </div>

                                    {/* Hover Glow Effect for Locked */}
                                    {isLocked && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
