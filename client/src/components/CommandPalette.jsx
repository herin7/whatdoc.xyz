import { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Plus, Settings } from 'lucide-react';

export default function CommandPalette({ projects = [] }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    // Toggle on Ctrl+Space / Cmd+K
    useEffect(() => {
        const handler = (e) => {
            if ((e.ctrlKey && e.code === 'Space') || (e.metaKey && e.key === 'k')) {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const runAction = (cb) => {
        setOpen(false);
        cb();
    };

    return (
        <Command.Dialog
            open={open}
            onOpenChange={setOpen}
            label="Command Palette"
            className="fixed inset-0 z-50"
            aria-describedby={undefined}
        >
            {/* Accessible title (visually hidden) */}
            <div className="sr-only">Command Palette</div>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setOpen(false)}
            />

            {/* Menu */}
            <div className="fixed inset-0 flex items-start justify-center pt-[20vh] pointer-events-none">
                <div className="bg-[#111] border border-white/10 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden pointer-events-auto">
                    {/* Input */}
                    <div className="flex items-center gap-3 px-4 border-b border-white/10">
                        <Search size={16} className="text-zinc-500 shrink-0" />
                        <Command.Input
                            placeholder="Search projects or commands..."
                            className="w-full py-3.5 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
                        />
                    </div>

                    {/* Results */}
                    <Command.List className="max-h-72 overflow-y-auto p-2">
                        <Command.Empty className="py-8 text-center text-sm text-zinc-500">
                            No results found.
                        </Command.Empty>

                        {projects.length > 0 && (
                            <Command.Group
                                heading="Projects"
                                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-zinc-500"
                            >
                                {projects.map((p) => (
                                    <Command.Item
                                        key={p._id}
                                        value={p.repoName}
                                        onSelect={() => runAction(() => navigate(`/editor/${p._id}`))}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 cursor-pointer transition-colors data-[selected=true]:bg-white/5 data-[selected=true]:text-white"
                                    >
                                        <FileText size={15} className="shrink-0 opacity-60" />
                                        <span className="truncate">{p.repoName}</span>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}

                        <Command.Group
                            heading="Actions"
                            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-zinc-500"
                        >
                            <Command.Item
                                value="Create New Project"
                                onSelect={() => runAction(() => navigate('/import'))}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 cursor-pointer transition-colors data-[selected=true]:bg-white/5 data-[selected=true]:text-white"
                            >
                                <Plus size={15} className="shrink-0 opacity-60" />
                                <span>Create New Project</span>
                            </Command.Item>
                            <Command.Item
                                value="Go to Settings"
                                onSelect={() => runAction(() => navigate('/dashboard'))}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 cursor-pointer transition-colors data-[selected=true]:bg-white/5 data-[selected=true]:text-white"
                            >
                                <Settings size={15} className="shrink-0 opacity-60" />
                                <span>Go to Settings</span>
                            </Command.Item>
                        </Command.Group>
                    </Command.List>
                </div>
            </div>
        </Command.Dialog>
    );
}
