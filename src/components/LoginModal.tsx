'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, Shield, Zap, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoginModalProps {
    clientId: string;
}

export default function LoginModal({ clientId }: LoginModalProps) {
    const { login, isAuthenticated } = useAuth();
    const googleButtonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isAuthenticated) return;

        // Load Google Identity Services script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;

        script.onload = () => {
            if (window.google && googleButtonRef.current) {
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCredentialResponse,
                    auto_select: false,
                    cancel_on_tap_outside: false,
                });

                window.google.accounts.id.renderButton(googleButtonRef.current, {
                    theme: 'outline',
                    size: 'large',
                    width: 280,
                    text: 'signin_with',
                    shape: 'rectangular',
                    logo_alignment: 'left',
                });
            }
        };

        document.head.appendChild(script);

        return () => {
            // Cleanup script on unmount
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, [clientId, isAuthenticated]);

    const handleCredentialResponse = (response: any) => {
        if (response.credential) {
            login(response.credential);
            // Welcome message now shows in bottom-left via WelcomeMessage component
        } else {
            toast.error('Login failed. Please try again.');
        }
    };

    // Don't render if user is authenticated
    if (isAuthenticated) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm">
            {/* Modal */}
            <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-none rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 md:p-12 max-w-md mx-4 animate-fadeIn">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl">
                            <Sparkles className="h-12 w-12 text-white animate-pulse-soft" />
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                        Welcome to BongoAI
                    </h1>

                    <p className="text-slate-600 dark:text-slate-400 text-lg mb-2">
                        Multi-modal AI Assistant
                    </p>

                    <p className="text-sm text-slate-500 dark:text-slate-500">
                        Powered by{' '}
                        <a
                            href="https://www.linkedin.com/in/rayhanalmim"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 underline font-medium"
                        >
                            Rayhan
                        </a>
                    </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 gap-4 mb-8">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50/80 dark:bg-blue-900/20 rounded-xl">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                            <Zap className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                                AWS Bedrock Models
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                Claude, Nova Canvas & Reel
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-purple-50/80 dark:bg-purple-900/20 rounded-xl">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                            <Globe className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                                Multi-Modal AI
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                Text, Image & Video Generation
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-emerald-50/80 dark:bg-emerald-900/20 rounded-xl">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                            <Shield className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                                Secure & Private
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                Your data stays protected
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sign in section */}
                <div className="text-center">
                    <p className="text-slate-700 dark:text-slate-300 mb-6 font-medium">
                        Sign in to start your AI journey
                    </p>

                    {/* Google Sign-in Button Container */}
                    <div className="flex justify-center mb-6">
                        <div
                            ref={googleButtonRef}
                            className="transition-all duration-200 hover:scale-105"
                        />
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-500 leading-relaxed">
                        By signing in, you agree to our{' '}
                        <span className="text-blue-600 hover:underline cursor-pointer">
                            Terms of Service
                        </span>{' '}
                        and{' '}
                        <span className="text-blue-600 hover:underline cursor-pointer">
                            Privacy Policy
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
} 