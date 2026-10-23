'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

interface User {
    id: string;
    googleId: string;
    name: string;
    email: string;
    picture: string;
    given_name: string;
    family_name: string;
    tokens: number;
    totalApiCalls: number;
    hasReceivedSignupBonus: boolean;
    createdAt: string;
    lastLogin: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    socket: Socket | null;
    login: (credential: string) => Promise<void>;
    logout: () => void;
    refreshUserData: () => Promise<void>;
    consumeTokens: (category: string, model: string) => Promise<boolean>;
    checkTokens: (category: string, model: string) => Promise<{ hasEnough: boolean, required: number, available: number }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8080';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [socket, setSocket] = useState<Socket | null>(null);

    // Initialize socket connection
    useEffect(() => {
        const newSocket = io(SERVER_URL, {
            withCredentials: true,
            autoConnect: false
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    // Handle socket events for real-time updates
    useEffect(() => {
        if (socket && user) {
            // Authenticate socket with user ID
            socket.emit('authenticate', user.id);

            // Listen for user updates
            socket.on('userUpdate', (updateData) => {
                console.log('Real-time update received:', updateData);

                if (updateData.type === 'tokensConsumed' || updateData.type === 'tokensAdded') {
                    setUser(prev => prev ? {
                        ...prev,
                        tokens: updateData.tokens,
                        totalApiCalls: updateData.totalApiCalls || prev.totalApiCalls
                    } : null);
                }
            });

            socket.connect();

            return () => {
                socket.off('userUpdate');
                socket.disconnect();
            };
        }
    }, [socket, user]);

    // Check for existing authentication on app load
    useEffect(() => {
        const checkAuth = async () => {
            const savedToken = Cookies.get('bongo-token');
            if (savedToken) {
                try {
                    const response = await fetch(`${SERVER_URL}/api/auth/verify-token`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token: savedToken }),
                    });

                    const data = await response.json();

                    if (data.success && data.user) {
                        setUser(data.user);
                        console.log('User authenticated from token:', data.user.email);
                    } else {
                        // Invalid token, clear it
                        Cookies.remove('bongo-token');
                        Cookies.remove('bongo-user');
                    }
                } catch (error) {
                    console.error('Token verification failed:', error);
                    Cookies.remove('bongo-token');
                    Cookies.remove('bongo-user');
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (credential: string) => {
        try {
            setIsLoading(true);

            const response = await fetch(`${SERVER_URL}/api/auth/google-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ credential }),
            });

            const data = await response.json();

            if (data.success && data.user && data.token) {
                setUser(data.user);

                // Save token and user data to cookies (expires in 7 days)
                Cookies.set('bongo-token', data.token, { expires: 7 });
                Cookies.set('bongo-user', JSON.stringify(data.user), { expires: 7 });

                console.log('Login successful:', data.user.email);

                if (!data.user.hasReceivedSignupBonus) {
                    console.log('🎉 New user received signup bonus!');
                }
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            if (user) {
                // Notify server about logout
                await fetch(`${SERVER_URL}/api/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: user.id }),
                });
            }
        } catch (error) {
            console.error('Logout request failed:', error);
        }

        // Clear local state and cookies
        setUser(null);
        Cookies.remove('bongo-token');
        Cookies.remove('bongo-user');

        // Disconnect socket
        if (socket) {
            socket.disconnect();
        }

        // Also revoke Google OAuth token
        if (typeof window !== 'undefined' && window.google) {
            window.google.accounts.id.disableAutoSelect();
        }
    };

    const refreshUserData = async () => {
        const token = Cookies.get('bongo-token');
        if (!token) return;

        try {
            const response = await fetch(`${SERVER_URL}/api/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.success && data.user) {
                setUser(data.user);
            }
        } catch (error) {
            console.error('Failed to refresh user data:', error);
        }
    };

    const consumeTokens = async (category: string, model: string): Promise<boolean> => {
        const token = Cookies.get('bongo-token');
        if (!token) return false;

        try {
            const response = await fetch(`${SERVER_URL}/api/user/consume-tokens`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category, model, endpoint: '/api/chat' }),
            });

            const data = await response.json();

            if (data.success) {
                // Update local user state
                setUser(prev => prev ? {
                    ...prev,
                    tokens: data.remainingTokens,
                    totalApiCalls: data.totalApiCalls
                } : null);
                return true;
            } else {
                console.error('Token consumption failed:', data.message);
                return false;
            }
        } catch (error) {
            console.error('Error consuming tokens:', error);
            return false;
        }
    };

    const checkTokens = async (category: string, model: string) => {
        const token = Cookies.get('bongo-token');
        if (!token) return { hasEnough: false, required: 0, available: 0 };

        try {
            const response = await fetch(`${SERVER_URL}/api/user/check-tokens`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category, model }),
            });

            const data = await response.json();
            return {
                hasEnough: data.hasEnoughTokens,
                required: data.required,
                available: data.available
            };
        } catch (error) {
            console.error('Error checking tokens:', error);
            return { hasEnough: false, required: 0, available: 0 };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated: !!user,
            socket,
            login,
            logout,
            refreshUserData,
            consumeTokens,
            checkTokens
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Type declaration for Google Identity Services
declare global {
    interface Window {
        google: {
            accounts: {
                id: {
                    initialize: (config: any) => void;
                    renderButton: (element: HTMLElement, config: any) => void;
                    prompt: () => void;
                    disableAutoSelect: () => void;
                };
            };
        };
    }
} 