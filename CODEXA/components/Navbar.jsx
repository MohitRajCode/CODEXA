import { Bell, Search } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between mb-8">
      {/* Search */}
      <div className="flex items-center gap-3 bg-[#0D101D] border border-[#23273b] rounded-xl px-4 py-3 w-80">
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none text-gray-300 placeholder-gray-500 text-sm w-full"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="relative w-10 h-10 rounded-xl bg-[#0D101D] border border-[#23273b] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-violet-500" />
        </button>

        <img
          src="https://i.pravatar.cc/150?img=12"
          className="w-10 h-10 rounded-full border-2 border-violet-500"
          alt="Avatar"
        />
      </div>
    </header>
  );
}
