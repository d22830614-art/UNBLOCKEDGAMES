/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, Terminal, Info, ExternalLink, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './data/games.json';

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = new Set(gamesData.map(g => g.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] font-sans selection:bg-[#00ff41] selection:text-[#000]">
      {/* Header / Nav */}
      <header className="sticky top-0 z-40 border-b border-[#222] bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedGame(null)}>
            <div className="w-10 h-10 bg-[#222] border border-[#333] rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-[#00ff41]" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tighter uppercase font-mono">GameVault</h1>
              <div className="text-[10px] text-[#555] uppercase tracking-[0.2em] font-mono leading-none">Access Unblocked</div>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" />
            <input 
              type="text" 
              placeholder="SEARCH ASSETS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111] border border-[#222] rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#00ff41]/50 focus:ring-1 focus:ring-[#00ff41]/20 transition-all font-mono"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-[#222] rounded-lg transition-colors border border-transparent hover:border-[#333]">
              <Info className="w-5 h-5 text-[#666]" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Strip */}
        <div className="flex overflow-x-auto gap-2 pb-6 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider border transition-all whitespace-nowrap ${
                activeCategory === cat 
                ? 'bg-[#00ff41] border-[#00ff41] text-[#000] font-bold' 
                : 'bg-transparent border-[#222] text-[#666] hover:border-[#444] hover:text-[#aaa]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => (
              <motion.div
                layout
                key={game.id}
                whileHover={{ y: -5 }}
                className="group relative bg-[#111] border border-[#222] rounded-xl overflow-hidden hover:border-[#00ff41]/30 transition-all shadow-lg"
                onClick={() => setSelectedGame(game)}
              >
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={game.thumbnail} 
                    alt={game.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000] to-transparent opacity-60" />
                  <div className="absolute top-3 right-3">
                    <span className="bg-[#000]/80 backdrop-blur px-2 py-1 rounded text-[10px] font-mono text-[#00ff41] border border-[#00ff41]/20">
                      {game.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-mono font-bold text-lg uppercase tracking-tight group-hover:text-[#00ff41] transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-[#666] text-sm line-clamp-2 mt-1 leading-snug">
                    {game.description}
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] text-[#444] font-mono">
                      <Terminal className="w-3 h-3" />
                      READY_TO_BOOT
                    </div>
                    <button className="text-[10px] font-mono text-[#00ff41] uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      INITIALIZE <ChevronLeft className="w-3 h-3 rotate-180" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="inline-block p-4 border border-dashed border-[#222] rounded-2xl">
                <Search className="w-12 h-12 text-[#222] mx-auto mb-4" />
                <p className="text-[#444] font-mono uppercase tracking-widest text-sm">No assets found in current vault query.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Game Modal / Overlay */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-[#000]/95 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-6xl h-full max-h-[90vh] bg-[#0a0a0a] border border-[#222] rounded-2xl flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-[#222] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="p-2 hover:bg-[#151515] rounded-lg transition-colors text-[#666] hover:text-[#eee]"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div>
                    <h2 className="font-mono font-bold text-xl uppercase tracking-tighter flex items-center gap-2">
                      {selectedGame.title}
                      <span className="text-[10px] font-normal text-[#444] px-2 py-0.5 border border-[#222] rounded ml-2">
                        {selectedGame.category}
                      </span>
                    </h2>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <a 
                    href={selectedGame.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-[#151515] rounded-lg transition-colors text-[#666] hover:text-[#00ff41]"
                    title="Open in new window"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <button 
                    onClick={() => {
                      const frame = document.getElementById('game-frame');
                      if (frame && frame.requestFullscreen) frame.requestFullscreen();
                    }}
                    className="p-2 hover:bg-[#151515] rounded-lg transition-colors text-[#666] hover:text-[#eee]"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="p-2 hover:bg-[#151515] rounded-lg transition-colors text-[#666] hover:text-[#ff4444]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Game Viewport */}
              <div className="flex-1 bg-[#000] relative">
                <iframe 
                  id="game-frame"
                  src={selectedGame.url}
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              </div>

              {/* Modal Footer / Meta */}
              <div className="p-4 bg-[#111] border-t border-[#222] flex items-center justify-between">
                <div className="flex items-center gap-3 text-[#444] font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse" />
                    LIVE_CONNECTION_ESTABLISHED
                  </div>
                  <div className="hidden sm:block">|</div>
                  <div className="hidden sm:block uppercase">ID: {selectedGame.id}</div>
                </div>
                <div className="text-[10px] text-[#444] font-mono uppercase tracking-widest">
                  GameVault v1.0.4-alpha
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Grid Pattern */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  );
}
