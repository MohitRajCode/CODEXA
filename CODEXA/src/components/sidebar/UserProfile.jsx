import { ChevronDown } from 'lucide-react';

export default function UserProfile() {
  return (
    <div className="mx-3 mb-3">
      <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
        <img
          src="https://i.pravatar.cc/150?img=12"
          alt="Mohit Verma"
          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 text-left min-w-0">
          <p className="text-white text-sm font-semibold truncate">Mohit Verma</p>
          <p className="text-[#9CA3AF] text-xs truncate">mohit@example.com</p>
        </div>
        <ChevronDown size={15} className="text-[#9CA3AF] flex-shrink-0" />
      </button>
    </div>
  );
}
