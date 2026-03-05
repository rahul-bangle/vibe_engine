import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../utils/cn';

interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
    isFeature?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
    icon: Icon,
    label,
    isActive,
    onClick,
    isFeature
}) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-4 px-3 py-2 rounded-md transition-all duration-200 group w-full text-left",
                isActive
                    ? "text-text-base"
                    : "text-text-subdued hover:text-text-base",
                isFeature && "hover:bg-background-highlight"
            )}
        >
            <Icon
                className={cn(
                    "w-6 h-6 transition-colors",
                    isActive ? "text-primary" : "text-text-subdued group-hover:text-text-base",
                    isFeature && isActive && "text-primary text-primary-hover"
                )}
            />
            <span className={cn(
                "font-bold text-sm transition-colors",
                isFeature ? "text-primary underline decoration-primary/30 underline-offset-4" : ""
            )}>
                {label}
            </span>
        </button>
    );
};
