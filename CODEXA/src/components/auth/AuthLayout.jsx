import AuthScene from './AuthScene';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#090B14] flex">
      {/* Left side: 3D Scene (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0D101D] overflow-hidden items-center justify-center border-r border-[#23273B]">
         <AuthScene />
         <div className="absolute inset-0 bg-gradient-to-t from-[#090B14] via-[#090B14]/40 to-transparent z-10 pointer-events-none"></div>
         
         {/* Value Proposition Content */}
         <div className="absolute z-20 bottom-12 left-12 right-12 pointer-events-none">
             <h2 className="text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
               Elevate Your Coding <span className="text-[#6D5DFB]">Environment</span>
             </h2>
             <p className="text-[#9CA3AF] text-lg leading-relaxed mb-8 max-w-xl">
                Codexa transforms your development workflow by providing a distraction-free, 
                highly productive ecosystem. Track your progress, manage sessions, and 
                write code with maximum focus in a healthy environment.
             </p>
             
             <div className="flex gap-4 max-w-xl">
               <div className="bg-[#121523]/60 backdrop-blur-md border border-[#23273B] rounded-2xl p-5 flex-1 shadow-lg shadow-[#6D5DFB]/5">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#6D5DFB]/10 flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#6D5DFB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div className="text-white font-semibold text-lg">Productivity</div>
                 </div>
                 <div className="text-[#9CA3AF] text-sm">Deep work sessions designed for peak performance.</div>
               </div>
               
               <div className="bg-[#121523]/60 backdrop-blur-md border border-[#23273B] rounded-2xl p-5 flex-1 shadow-lg shadow-[#10B981]/5">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="text-white font-semibold text-lg">Health</div>
                 </div>
                 <div className="text-[#9CA3AF] text-sm">Built-in breaks and wellness tracking for coders.</div>
               </div>
             </div>
         </div>
      </div>
      
      {/* Right side: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#090B14]">
         {children}
      </div>
    </div>
  );
}
