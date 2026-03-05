import React from 'react';
import { UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

interface FriendActivity {
    name: string;
    sub: string;
    time: string;
    status?: 'active';
}

const FriendItem: React.FC<FriendActivity> = ({ name, sub, time, status }) => (
    <div className="flex items-start space-x-3 group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
        <div className="relative flex-shrink-0">
            <img
                src={`https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random&color=fff`}
                className="w-10 h-10 rounded-full border border-white/10"
                alt={name}
            />
            {status === 'active' && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary border-2 border-black rounded-full" />
            )}
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-0.5">
                <p className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{name}</p>
                <span className="text-[10px] text-text-subdued">{time}</span>
            </div>
            <div className="text-xs text-text-subdued truncate flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 inline-block mr-1.5" />
                <span className="truncate">{sub}</span>
            </div>
        </div>
    </div>
);

export const FriendSidebar: React.FC = () => {
    const activities: FriendActivity[] = [
        { name: "Adrian Presley", sub: "Ongoing Thing, by 20syl", time: "2m ago" },
        { name: "Ashley Amber", sub: "Awake, by Tycho", time: "6m ago" },
        { name: "Chris Blumenfeld", sub: "Step by Step, by Uppermost", time: "just now", status: "active" },
        { name: "John Carmack", sub: "The Lex Fridman Podcast", time: "5h ago" }
    ];

    return (
        <aside className="w-[280px] bg-black border-l border-white/5 p-6 space-y-8 hidden xl:flex flex-col mt-2 mb-2 mr-2 rounded-lg">
            <div className="flex items-center justify-between">
                <p className="text-xs font-black text-text-subdued uppercase tracking-[0.2em]">Friend Activity</p>
                <button className="text-text-subdued hover:text-white transition-colors">
                    <UserPlus size={18} />
                </button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar">
                {activities.map((friend, i) => (
                    <motion.div
                        key={friend.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <FriendItem {...friend} />
                    </motion.div>
                ))}
            </div>

            <button className="w-full py-3 bg-[#242424] hover:bg-[#333] transition-colors rounded-full text-xs font-black uppercase tracking-widest text-white/80 hover:text-white flex items-center justify-center space-x-2 shadow-lg">
                <span>Invite a friend</span>
            </button>
        </aside>
    );
};
