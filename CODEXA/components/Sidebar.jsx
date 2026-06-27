import {
    LayoutDashboard,
    Clock3,
    FolderKanban,
    BarChart3,
    Target,
    CalendarDays,
    GitBranch,
    Settings,
    Crown,
    ChevronDown,
} from "lucide-react";

const menuItems = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        active: true,
    },
    {
        name: "Sessions",
        icon: Clock3,
    },
    {
        name: "Projects",
        icon: FolderKanban,
    },
    {
        name: "Analytics",
        icon: BarChart3,
    },
    {
        name: "Goals",
        icon: Target,
    },
    {
        name: "Calendar",
        icon: CalendarDays,
    },
    {
        name: "GitHub",
        icon: GitBranch,
    },
    {
        name: "Settings",
        icon: Settings,
    },
];

export default function Sidebar() {
    return (
        <aside className="w-[270px] bg-[#0D101D] border-r border-[#23273b] flex flex-col justify-between">

            {/* Top */}

            <div>

                {/* Logo */}

                <div className="px-7 py-8 flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-700 flex items-center justify-center">

                        <GitBranch size={22} />

                    </div>

                    <h1 className="text-3xl font-bold tracking-wide">
                        Codexa
                    </h1>

                </div>

                {/* Menu */}

                <div className="px-4 mt-6 space-y-2">

                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.name}
                                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300
                ${item.active
                                        ? "bg-violet-600 text-white"
                                        : "hover:bg-[#171B2D] text-gray-400 hover:text-white"
                                    }`}
                            >
                                <Icon size={21} />

                                <span className="text-[16px] font-medium">
                                    {item.name}
                                </span>
                            </button>
                        );
                    })}
                </div>

            </div>

            {/* Bottom */}

            <div className="px-5 pb-6">

                {/* User */}

                <div className="bg-[#121523] border border-[#23273b] rounded-2xl p-4 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <img
                            src="https://i.pravatar.cc/150?img=12"
                            className="w-12 h-12 rounded-full"
                            alt=""
                        />

                        <div>

                            <h3 className="font-semibold">
                                Mohit Verma
                            </h3>

                            <p className="text-sm text-gray-400">
                                mohit@example.com
                            </p>

                        </div>

                    </div>

                    <ChevronDown size={18} />
                </div>

                {/* Premium */}

                <div className="mt-6 rounded-2xl overflow-hidden bg-gradient-to-br from-violet-700 via-violet-600 to-indigo-700">

                    <div className="p-6">

                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">

                            <Crown size={22} />

                        </div>

                        <h2 className="mt-6 text-2xl font-bold">

                            Go Premium

                        </h2>

                        <p className="text-sm mt-3 text-violet-100 leading-6">

                            Unlock powerful insights and boost your productivity.

                        </p>

                        <button className="mt-8 w-full bg-white text-violet-700 py-3 rounded-xl font-semibold hover:scale-105 duration-300">

                            Upgrade Now

                        </button>

                    </div>

                </div>

            </div>

        </aside>
    );
}