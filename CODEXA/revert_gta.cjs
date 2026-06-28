const fs = require('fs');
const files = ['src/pages/auth/Login.jsx', 'src/pages/auth/Register.jsx'];

const replacements = [
    ['className="bg-black/60 backdrop-blur-2xl border border-[#ff007f]/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(255,0,127,0.15)]"', 'className="bg-[#121523] border border-[#23273B] rounded-2xl p-6"'],
    ['className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff007f] to-[#ffaa00] flex items-center justify-center shadow-[0_0_15px_rgba(255,0,127,0.5)]"', 'className="w-9 h-9 rounded-xl bg-[#6D5DFB] flex items-center justify-center"'],
    ['className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:border-[#00e5ff]/50 hover:bg-white/10 transition-colors cursor-pointer"', 'className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1E2235] border border-[#23273B] text-white text-sm font-medium hover:border-[#6D5DFB]/50 transition-colors cursor-pointer"'],
    ['className="flex-1 h-px bg-gradient-to-r from-transparent via-[#ff007f]/50 to-transparent"', 'className="flex-1 h-px bg-[#23273B]"'],
    ['className="w-full bg-black/40 border border-[#ff007f]/30 rounded-xl px-4 py-2.5 text-[#00e5ff] text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#00e5ff] focus:shadow-[0_0_10px_rgba(0,229,255,0.2)] transition-all"', 'className="w-full bg-[#0D101D] border border-[#23273B] rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#6D5DFB] transition-colors"'],
    ['className="w-full bg-black/40 border border-[#ff007f]/30 rounded-xl px-4 py-2.5 pr-10 text-[#00e5ff] text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#00e5ff] focus:shadow-[0_0_10px_rgba(0,229,255,0.2)] transition-all"', 'className="w-full bg-[#0D101D] border border-[#23273B] rounded-xl px-4 py-2.5 pr-10 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#6D5DFB] transition-colors"'],
    ['className="w-full bg-gradient-to-r from-[#ff007f] to-[#ffaa00] hover:shadow-[0_0_20px_rgba(255,0,127,0.5)] border-none disabled:opacity-60 text-white font-bold tracking-wide py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"', 'className="w-full bg-[#6D5DFB] hover:bg-[#5a4ce6] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"'],
    ['className="w-full bg-gradient-to-r from-[#ff007f] to-[#ffaa00] hover:shadow-[0_0_20px_rgba(255,0,127,0.5)] border-none disabled:opacity-60 text-white font-bold tracking-wide py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer mt-1"', 'className="w-full bg-[#6D5DFB] hover:bg-[#5a4ce6] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer mt-1"'],
    ['className="text-[#00e5ff] text-xs hover:text-[#b3fbff] drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]"', 'className="text-[#6D5DFB] text-xs hover:text-[#8B7CF8]"'],
    ['className="text-[#00e5ff] hover:text-[#b3fbff] font-bold drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]"', 'className="text-[#6D5DFB] hover:text-[#8B7CF8] font-medium"']
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    replacements.forEach(([target, replacement]) => {
        content = content.split(target).join(replacement);
    });
    fs.writeFileSync(file, content);
});
