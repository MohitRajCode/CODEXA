import { ChevronRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

export default function UserProfile() {
  const { user, profile } = useAuthContext();
  const navigate = useNavigate();

  const displayName = profile?.full_name || profile?.username || user?.email?.split('@')[0] || 'User';
  const email = user?.email || '';
  const avatarUrl = profile?.avatar_url;
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="mx-3 mb-3">
      <button
        onClick={() => navigate('/dashboard/profile')}
        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
      >
        {/* Avatar */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-2 ring-[#6D5DFB]/30"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6D5DFB] to-[#38BDF8] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
            {initials || <User size={14} />}
          </div>
        )}

        {/* Name + email */}
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-white text-sm font-semibold truncate">{displayName}</p>
            {profile?.plan === 'pro' && (
              <span className="bg-[#6D5DFB]/20 text-[#6D5DFB] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase border border-[#6D5DFB]/30">
                PRO
              </span>
            )}
          </div>
          <p className="text-[#9CA3AF] text-xs truncate">{email}</p>
        </div>

        <ChevronRight size={14} className="text-[#6B7280] group-hover:text-[#6D5DFB] transition-colors flex-shrink-0" />
      </button>
    </div>
  );
}
