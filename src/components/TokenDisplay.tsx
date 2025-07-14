'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Zap, TrendingUp, Clock } from 'lucide-react';

export default function TokenDisplay() {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated || !user) return null;

    const getTokenColor = (tokens: number) => {
        if (tokens >= 7) return 'text-emerald-600 dark:text-emerald-400';
        if (tokens >= 3) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getTokenBgColor = (tokens: number) => {
        if (tokens >= 7) return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
        if (tokens >= 3) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    };

    return (
        <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all duration-200 ${getTokenBgColor(user.tokens)}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 md:space-x-3">
                    <div className={`p-2 rounded-lg ${user.tokens >= 7 ? 'bg-emerald-100 dark:bg-emerald-800' : user.tokens >= 3 ? 'bg-yellow-100 dark:bg-yellow-800' : 'bg-red-100 dark:bg-red-800'}`}>
                        <Zap className={`w-4 h-4 md:w-5 md:h-5 ${getTokenColor(user.tokens)}`} />
                    </div>
                    <div>
                        <p className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400">
                            Available Tokens
                        </p>
                        <p className={`text-lg md:text-xl font-bold ${getTokenColor(user.tokens)}`}>
                            {user.tokens}
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 mb-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>Total Calls</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {user.totalApiCalls}
                    </p>
                </div>
            </div>

            {/* Token costs info */}
            <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <Clock className="w-3 h-3" />
                    <span>Token Costs</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                        <span className="font-medium text-blue-600 dark:text-blue-400">Text</span>
                        <p className="text-slate-600 dark:text-slate-400">1 token</p>
                    </div>
                    <div className="text-center">
                        <span className="font-medium text-purple-600 dark:text-purple-400">Image</span>
                        <p className="text-slate-600 dark:text-slate-400">2 tokens</p>
                    </div>
                    <div className="text-center">
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">Video</span>
                        <p className="text-slate-600 dark:text-slate-400">3 tokens</p>
                    </div>
                </div>
            </div>

            {/* Low token warning */}
            {user.tokens <= 2 && (
                <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-xs font-medium text-red-700 dark:text-red-400">
                        ⚠️ Low tokens! You have {user.tokens} token{user.tokens !== 1 ? 's' : ''} remaining.
                    </p>
                </div>
            )}

            {/* New user bonus info */}
            {user.hasReceivedSignupBonus && user.totalApiCalls === 0 && (
                <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
                        🎉 Welcome! You received 10 free tokens to get started.
                    </p>
                </div>
            )}
        </div>
    );
} 