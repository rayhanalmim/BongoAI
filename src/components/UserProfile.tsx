'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserProfile() {
    const { user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Reset image error when user changes
    useEffect(() => {
        setImageError(false);
    }, [user?.picture]);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
        toast.success('Logged out successfully');
    };

    const handleImageError = () => {
        setImageError(true);
    };

    if (!user) return null;

    // Determine if we should show the fallback icon
    const showFallback = !user.picture || imageError;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Profile Button */}
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 p-1.5 md:p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg md:rounded-xl transition-all duration-200 hover:scale-105 group"
                title={user.name}
            >
                <div className="relative">
                    {showFallback ? (
                        // Fallback User Icon
                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 border-2 border-transparent group-hover:border-blue-300 transition-all duration-200 shadow-soft flex items-center justify-center">
                            <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </div>
                    ) : (
                        // User Profile Image
                        <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={user.picture}
                                alt={user.name}
                                onError={handleImageError}
                                className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-transparent group-hover:border-blue-300 transition-all duration-200 shadow-soft"
                            />
                        </>
                    )}
                    {/* Online indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                </div>
                <div className="hidden md:block text-left min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate max-w-24">
                        {user.given_name || user.name}
                    </p>
                </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 py-2 z-50 animate-fadeIn">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex items-center space-x-3">
                            {showFallback ? (
                                // Fallback User Icon in Dropdown
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-soft flex items-center justify-center">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                            ) : (
                                // User Profile Image in Dropdown
                                <>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={user.picture}
                                        alt={user.name}
                                        onError={handleImageError}
                                        className="w-12 h-12 rounded-full shadow-soft"
                                    />
                                </>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                                    {user.name}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                        <button
                            onClick={() => {
                                setIsDropdownOpen(false);
                                toast.success('Profile settings coming soon!');
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                        </button>

                        <button
                            onClick={() => {
                                setIsDropdownOpen(false);
                                toast.success('Settings coming soon!');
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                        </button>

                        <div className="border-t border-slate-200/50 dark:border-slate-700/50 my-1"></div>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sign out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
} 