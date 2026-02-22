import { useState, useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
    const [apiKey, setApiKey] = useState('');
    const [model, setModel] = useState('gemini-2.5-flash-lite');

    useEffect(() => {
        if (!isOpen) return;
        const savedKey = localStorage.getItem('wtd_gemini_key') || '';
        const savedModel = localStorage.getItem('wtd_gemini_model') || 'gemini-2.5-flash-lite';
        setApiKey(savedKey);
        setModel(savedModel);
    }, [isOpen]);

    if (!isOpen) return null;

    function handleSave() {
        localStorage.setItem('wtd_gemini_key', apiKey);
        localStorage.setItem('wtd_gemini_model', model);
        onClose();
    }

    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <h2 className="text-white text-lg font-semibold">Engine Settings</h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-500 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-5">
                    {/* Model Dropdown */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Model</label>
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="w-full bg-[#111] border border-zinc-800 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors appearance-none cursor-pointer"
                        >
                            <option value="gemini-2.5-flash-lite">Gemini 2.5 Flash-Lite (Fast, Default)</option>
                            <option value="gemini-2.5-pro">Gemini 2.5 Pro (High Quality, BYOK)</option>
                        </select>
                    </div>

                    {/* API Key Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">API Key</label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="AIzaSy..."
                            className="w-full bg-[#111] border border-zinc-800 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-600"
                        />
                        <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-xs text-zinc-500 hover:text-emerald-400 transition-colors"
                        >
                            Get a free key from Google AI Studio ↗
                        </a>
                    </div>

                    {/* Trust Badge */}
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg flex items-start gap-2 text-xs">
                        <ShieldCheck size={16} className="mt-0.5 shrink-0" />
                        <span>
                            Your key is encrypted and stored locally in your browser. It is never saved to our database.
                        </span>
                    </div>
                </div>

                {/* Save Button */}
                <div className="px-6 pb-5">
                    <button
                        onClick={handleSave}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-2.5 rounded-lg transition-colors text-sm"
                    >
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
}
