'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles } from 'lucide-react';

export default function WelcomeMessage() {
    const { isAuthenticated, user } = useAuth();
    const [show, setShow] = useState(false);
    const [hasShown, setHasShown] = useState(false);

    useEffect(() => {
        // Show welcome message when user first authenticates (not on page refresh)
        if (isAuthenticated && user && !hasShown) {
            setShow(true);
            setHasShown(true);

            // Hide after 5 seconds
            const timer = setTimeout(() => setShow(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, user, hasShown]);

    if (!show || !user) return null;

    return (
        <div className="fixed bottom-4 left-4 z-50 animate-fadeIn">
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-4 max-w-sm">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-lg">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div className='hidden md:block'>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            Welcome to BongoAI! 🎉
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            Hello {user.given_name || user.name?.split(' ')[0]}! Ready to create?
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 