import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoveLeft, Keyboard, Music, Search } from 'lucide-react';

export default function NotFound() {
    const [search, setSearch] = useState('');

    const cheatCodes = [
        { name: "McDonald's Theme", notes: "1 2 3  6 5" },
        { name: "Never Gonna Give You Up", notes: "1242665 1242554 124245321154" },
        { name: "Astronomia (Coffin Dance)", notes: "22 6543 345 432 243434" },
        { name: "Tetris Theme", notes: "0 7 8 9 8 7 6 8 0 9 8 7 7 8 9 0 8 6 6" },
        { name: "All Star - Smash Mouth", notes: "55 977 6655 877 6655" },
        { name: "Interstellar", notes: "60 60 70 70 80 80 90 90 76" },
        { name: "National Anthem of USSR", notes: "8 5 8 5 6 7 3 3 6 5 4 5 1 1 2 2 3 4" },
        { name: "Hips Don't Lie (Shakira)", notes: "8 764 4564 7 653 3453 654 765 6" },
        { name: "Zelda's Lullaby", notes: "3 52 123 52 3 59 85 4323" },
        { name: "Saria's Song (Lost Woods)", notes: "467 467 46709 78753 2353" },
        { name: "FNAF 6:00AM", notes: "4 6 5 1 1 5 6 4" },
        { name: "Happy Birthday", notes: "1 1 2 1 4 3 1 1 2 1 5 4" },
        { name: "Doofenshmirtz Evil Inc.", notes: "5 3 5  7 5 7  9999" },
        { name: "Megalovania", notes: "2 2 9 6 5 4 2 4 5" },
        { name: "Stranger Things", notes: "1 3 5 7 8 7 5 3 1 3 5 7 8 7 5 3" },
        { name: "Wii Sports Theme", notes: "1 2 4 3 2 1 5 3 4 5 8 7 8 5 3 1 2 3 2" },
        { name: "Darude - Sandstorm", notes: "77777 7777777 0000000 9999999 66" },
        { name: "Harry Potter Theme", notes: "36 876 09 7 6 875 3" },
        { name: "Tokyo Ghoul OP (Unravel)", notes: "89876 9876 65 5453 333300" },
        { name: "Gravity Falls Theme", notes: "2346561 2343 5654 4446654" },
        { name: "Attack on Titan OP 1", notes: "2243 11 22431 64 53 42 31" },
        { name: "Pirates of the Caribbean", notes: "3 5 6 6 6 7 8 8 8 9 7 7 6 5 5 6" },
        { name: "Fortnite Default Dance", notes: "3 3 5 6 5  3 5 6 5 3 2 3 6 5 3 2 3" },
    ];

    const filteredCodes = cheatCodes.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden font-sans">

            <div className="absolute top-0 left-1/2 w-[800px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] -translate-x-1/2 pointer-events-none"></div>

            <div className="w-full max-w-6xl z-10 flex flex-col lg:flex-row gap-12 items-center lg:items-start">

                <div className="flex-1 w-full space-y-8 mt-4">

                    <div className="space-y-2 text-center lg:text-left">
                        <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-emerald-800 tracking-tighter">
                            404
                        </h1>
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            Bro got lost. Play the trumpet instead. 🎺
                        </h2>
                        <p className="text-zinc-400 text-sm">
                            The docs you're looking for don't exist. But since you're here, <strong className="text-emerald-400">click the video below</strong> and press the <strong className="text-emerald-400">number keys (1-9)</strong> on your keyboard to play.
                        </p>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>

                        <div className="relative bg-black rounded-xl border border-zinc-800 overflow-hidden shadow-2xl aspect-video">

                            <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md border border-zinc-700/50 text-xs text-white px-3 py-1.5 rounded-full flex items-center gap-2 z-10 pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity">
                                <Keyboard className="w-3 h-3 text-emerald-400" />
                                Click video, then press 1-9
                            </div>

                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/xa17zHJhNhA?si=LE3DHh2VzrDW90yB&controls=0&autoplay=1"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-center lg:justify-start">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-semibold rounded-full hover:bg-emerald-400 hover:text-white transition-all duration-300 group shadow-[0_0_20px_rgba(52,211,153,0.1)] hover:shadow-[0_0_40px_rgba(52,211,153,0.3)]"
                        >
                            <MoveLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Alright, take me back to safety
                        </Link>
                    </div>
                </div>

                <div className="w-full lg:w-[420px] shrink-0 flex flex-col h-[650px]">
                    <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl shadow-2xl relative flex flex-col flex-1 overflow-hidden">

                        <div className="p-6 pb-4 border-b border-zinc-800 bg-[#0a0a0a] z-10 shrink-0">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                    <Music className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold">Cheat Codes</h3>
                                    <p className="text-xs text-zinc-500 font-mono">// courtesy of the comments</p>
                                </div>
                            </div>

                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="Search for a song..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-[#111] border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3f3f46 transparent' }}>
                            {filteredCodes.length > 0 ? (
                                filteredCodes.map((song, index) => (
                                    <div key={index} className="group cursor-default">
                                        <div className="text-sm font-medium text-zinc-300 mb-1 flex justify-between items-center">
                                            {song.name}
                                        </div>
                                        <div className="font-mono text-xs text-emerald-500 bg-emerald-500/5 p-2.5 rounded-md border border-emerald-500/10 break-all leading-relaxed group-hover:bg-emerald-500/10 transition-colors">
                                            {song.notes}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-zinc-500 text-sm py-10 font-mono">
                                    No songs found. Skill issue. 💀
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-[#050505] border-t border-zinc-800 shrink-0">
                            <p className="text-center text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                                Press 0 to reset pitch
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}