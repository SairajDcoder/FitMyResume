import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';
import { Cog6ToothIcon } from '../icons';
import { Page } from '../../App';

const LogoutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);

interface ProfileDropdownProps {
    setActivePage: (page: Page) => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ setActivePage }) => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    if (!user) return null;

    const handleSettingsClick = () => {
        setActivePage('settings');
        setIsOpen(false);
    }
    
    const handleLogoutClick = () => {
        logout();
        setIsOpen(false);
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)}>
                <Avatar user={user} className="w-9 h-9 cursor-pointer" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        <div className="px-4 py-2 border-b border-border">
                            <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <button
                            onClick={handleSettingsClick}
                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted"
                        >
                            <Cog6ToothIcon className="w-4 h-4 text-muted-foreground" />
                            Settings
                        </button>
                         <button
                            onClick={handleLogoutClick}
                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                        >
                            <LogoutIcon className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;