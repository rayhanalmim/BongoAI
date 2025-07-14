'use client';

import { useState, useRef } from 'react';
import { Send, Bot, User, Loader2, Copy, Check, Plus, MessageSquare, Video, Upload, X, Menu, Sun, Moon, Sparkles, Zap, Camera } from 'lucide-react';
import { bedrockModels, ModelKey, CategoryKey, modelCategories, getModelsByCategory } from '@/config/aws';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import UserProfile from '@/components/UserProfile';
import TokenDisplay from '@/components/TokenDisplay';
import toast from 'react-hot-toast';

interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    model?: string;
    type?: 'text' | 'image' | 'video';
    imageUrl?: string;
}

interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    category: CategoryKey;
    lastUpdated: Date;
}

export default function ChatInterface() {
    const { toggleTheme, isDark } = useTheme();
    const { isAuthenticated, isLoading: authLoading, consumeTokens, checkTokens } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('text');
    const [selectedModel, setSelectedModel] = useState<ModelKey>('claude-3-7-sonnet');
    const [maxTokens, setMaxTokens] = useState(1000);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false); // Start closed on mobile
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Show loading state
    if (authLoading) {
        return (
            <div className="flex items-center justify-center h-screen gradient-bg">
                <div className="text-center">
                    <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-xl">
                        <Sparkles className="h-10 w-10 text-white animate-pulse-soft" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        Loading BongoAI...
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        Preparing your AI assistant
                    </p>
                </div>
            </div>
        );
    }

    // Filter conversations by selected category
    const filteredConversations = conversations.filter(conv => conv.category === selectedCategory);
    const currentConversation = conversations.find(conv => conv.id === currentConversationId);
    const messages = currentConversation?.messages || [];

    const getCategoryIcon = (category: CategoryKey) => {
        switch (category) {
            case 'text': return <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />;
            case 'image': return <Camera className="w-3 h-3 sm:w-4 sm:h-4" />;
            case 'video': return <Video className="w-3 h-3 sm:w-4 sm:h-4" />;
        }
    };

    const getCategoryColors = (category: CategoryKey, isSelected: boolean) => {
        if (isSelected) {
            switch (category) {
                case 'text': return 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25';
                case 'image': return 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/25';
                case 'video': return 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/25';
            }
        } else {
            return `bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500`;
        }
    };

    const createNewConversation = (category: CategoryKey = 'text') => {
        if (!isAuthenticated) return;

        const newConversation: Conversation = {
            id: Date.now().toString(),
            title: `New ${modelCategories[category]} Chat`,
            messages: [],
            category,
            lastUpdated: new Date(),
        };
        setConversations(prev => [newConversation, ...prev]);
        setCurrentConversationId(newConversation.id);
        setSelectedCategory(category);

        // Set default model for category
        const modelsInCategory = getModelsByCategory(category);
        if (modelsInCategory.length > 0) {
            setSelectedModel(modelsInCategory[0][0] as ModelKey);
        }

        // Close sidebar on mobile after creating conversation
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    };

    const handleCategoryChange = (category: CategoryKey) => {
        if (!isAuthenticated) return;

        setSelectedCategory(category);

        // Update model selection based on category
        const modelsInCategory = getModelsByCategory(category);
        if (modelsInCategory.length > 0) {
            setSelectedModel(modelsInCategory[0][0] as ModelKey);
        }

        // If current conversation doesn't match the new category, clear the selection
        if (currentConversation && currentConversation.category !== category) {
            setCurrentConversationId(null);
        }

        // If there are existing conversations for this category, optionally select the most recent one
        const categoryConversations = conversations.filter(conv => conv.category === category);
        if (categoryConversations.length > 0 && !currentConversationId) {
            // Optionally auto-select the most recent conversation for this category
            // setCurrentConversationId(categoryConversations[0].id);
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const sendMessage = async () => {
        if ((!input.trim() && !uploadedImage) || isLoading || !isAuthenticated) return;

        if (!currentConversationId) {
            createNewConversation(selectedCategory);
            return;
        }

        // Check if user has enough tokens before proceeding
        try {
            const tokenCheck = await checkTokens(selectedCategory, selectedModel);
            if (!tokenCheck.hasEnough) {
                toast.error(`Insufficient tokens! You need ${tokenCheck.required} tokens but only have ${tokenCheck.available}.`);
                return;
            }
        } catch (error) {
            toast.error('Failed to check token balance. Please try again.');
            return;
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input,
            role: 'user',
            timestamp: new Date(),
            type: selectedCategory === 'text' ? 'text' : selectedCategory,
            imageUrl: uploadedImage || undefined,
        };

        // Update conversation with user message
        setConversations(prev => prev.map(conv =>
            conv.id === currentConversationId
                ? {
                    ...conv,
                    messages: [...conv.messages, userMessage],
                    title: conv.messages.length === 0 ? input.slice(0, 30) + '...' : conv.title,
                    lastUpdated: new Date()
                }
                : conv
        ));

        const currentInput = input;
        const currentImage = uploadedImage;
        setInput('');
        setUploadedImage(null);
        setIsLoading(true);

        try {
            // Consume tokens before making the API call
            const tokenConsumed = await consumeTokens(selectedCategory, selectedModel);
            if (!tokenConsumed) {
                throw new Error('Failed to consume tokens. Your request cannot be processed.');
            }

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: currentInput,
                    modelKey: selectedModel,
                    maxTokens,
                    category: selectedCategory,
                    imageData: currentImage,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get response');
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: data.response,
                role: 'assistant',
                timestamp: new Date(),
                model: data.model,
                type: selectedCategory,
                imageUrl: data.imageUrl,
            };

            // Update conversation with assistant message
            setConversations(prev => prev.map(conv =>
                conv.id === currentConversationId
                    ? {
                        ...conv,
                        messages: [...conv.messages, assistantMessage],
                        lastUpdated: new Date()
                    }
                    : conv
            ));

            toast.success('Response received!');
        } catch (error) {
            console.error('Send message error:', error);
            toast.error(error instanceof Error ? error.message : 'Something went wrong');

            // If there was an error, restore the input values
            setInput(currentInput);
            setUploadedImage(currentImage);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = async (text: string, messageId: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(messageId);
            toast.success('Copied to clipboard!');
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            toast.error('Failed to copy to clipboard');
        }
    };

    const deleteConversation = (conversationId: string) => {
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
        if (currentConversationId === conversationId) {
            setCurrentConversationId(null);
        }
    };

    const selectConversation = (conversationId: string) => {
        setCurrentConversationId(conversationId);
        // Close sidebar on mobile after selecting conversation
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className={`flex h-screen gradient-bg relative ${!isAuthenticated ? 'pointer-events-none select-none' : ''}`}>
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-50 md:z-auto w-80 md:w-80 lg:w-96 h-full transition-all duration-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col shadow-elegant`}>
                {/* Sidebar Header */}
                <div className="p-4 md:p-6 border-b border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <div className="flex items-center space-x-2 md:space-x-3">
                            <div className="p-1.5 md:p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg md:rounded-xl shadow-lg">
                                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            </div>
                            <h2 className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100">Conversations</h2>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            disabled={!isAuthenticated}
                        >
                            <X className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </button>
                    </div>

                    {/* Token Display */}
                    <div className="mb-4 md:mb-6">
                        <TokenDisplay />
                    </div>

                    {/* Category Selector */}
                    <div className="space-y-3">
                        <label className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">Category:</label>
                        <div className="grid grid-cols-3 gap-1.5 md:gap-2">
                            {Object.entries(modelCategories).map(([key, label]) => (
                                <button
                                    key={key}
                                    onClick={() => handleCategoryChange(key as CategoryKey)}
                                    disabled={!isAuthenticated}
                                    className={`p-2 md:p-3 text-xs rounded-lg md:rounded-xl border transition-all duration-200 flex flex-col items-center justify-center space-y-1 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${getCategoryColors(key as CategoryKey, selectedCategory === key)}`}
                                >
                                    {getCategoryIcon(key as CategoryKey)}
                                    <span className="font-medium leading-tight">{label.split(' ')[0]}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* New Conversation Button */}
                    <button
                        onClick={() => createNewConversation(selectedCategory)}
                        disabled={!isAuthenticated}
                        className="w-full mt-4 md:mt-6 p-2.5 md:p-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-lg md:rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-sm md:text-base disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <Plus className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="font-medium">New Chat</span>
                    </button>
                </div>

                {/* Conversations List - Filtered by Category */}
                <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2">
                    {filteredConversations.length === 0 ? (
                        <div className="text-center py-6 md:py-8">
                            <div className={`p-2.5 md:p-3 rounded-lg md:rounded-xl w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 flex items-center justify-center ${selectedCategory === 'text' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                selectedCategory === 'image' ? 'bg-purple-100 dark:bg-purple-900/30' :
                                    'bg-emerald-100 dark:bg-emerald-900/30'
                                }`}>
                                {getCategoryIcon(selectedCategory)}
                            </div>
                            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-2">
                                No {modelCategories[selectedCategory].toLowerCase()} conversations yet
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                                Click &quot;New Chat&quot; to start
                            </p>
                        </div>
                    ) : (
                        filteredConversations.map((conversation) => (
                            <div
                                key={conversation.id}
                                onClick={() => selectConversation(conversation.id)}
                                className={`p-3 md:p-4 rounded-lg md:rounded-xl cursor-pointer transition-all duration-200 group hover:scale-[1.02] active:scale-95 animate-fadeIn ${currentConversationId === conversation.id
                                    ? 'bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 shadow-soft'
                                    : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50 border border-transparent'
                                    } ${!isAuthenticated ? 'pointer-events-none' : ''}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className={`p-1 md:p-1.5 rounded-md md:rounded-lg ${conversation.category === 'text' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                                conversation.category === 'image' ? 'bg-purple-100 dark:bg-purple-900/30' :
                                                    'bg-emerald-100 dark:bg-emerald-900/30'
                                                }`}>
                                                {getCategoryIcon(conversation.category)}
                                            </div>
                                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                {modelCategories[conversation.category]}
                                            </span>
                                        </div>
                                        <p className="text-xs md:text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                            {conversation.title}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {conversation.messages.length} messages
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteConversation(conversation.id);
                                        }}
                                        disabled={!isAuthenticated}
                                        className="opacity-0 group-hover:opacity-100 p-1 md:p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md md:rounded-lg transition-all disabled:cursor-not-allowed"
                                    >
                                        <X className="w-3 h-3 text-red-600 dark:text-red-400" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-soft border-b border-slate-200/50 dark:border-slate-700/50 p-3 md:p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                disabled={!isAuthenticated}
                            >
                                <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            </button>
                            <div className="flex items-center space-x-2 md:space-x-3 min-w-0">
                                <div className="p-2 md:p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg md:rounded-xl shadow-lg">
                                    <Bot className="h-4 w-4 md:h-6 md:w-6 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-base md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                                        BongoAI
                                    </h1>
                                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                        {currentConversation
                                            ? `${modelCategories[currentConversation.category]} • ${currentConversation.title}`
                                            : <>Powered by <a
                                                href="https://www.linkedin.com/in/rayhanalmim"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="underline hover:text-blue-500"
                                            >Rayhan</a></>}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 md:space-x-4">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 hover:scale-105"
                                title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                            >
                                {isDark ? (
                                    <Sun className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                                ) : (
                                    <Moon className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />
                                )}
                            </button>



                            {/* Desktop Controls */}
                            <div className="hidden lg:flex items-center space-x-4">
                                {/* Model Selector */}
                                <div className="flex items-center space-x-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Model:</label>
                                    <select
                                        value={selectedModel}
                                        onChange={(e) => setSelectedModel(e.target.value as ModelKey)}
                                        disabled={!isAuthenticated}
                                        className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-slate-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {getModelsByCategory(selectedCategory).map(([key, model]) => (
                                            <option key={key} value={key}>
                                                {model.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Max Tokens */}
                                <div className="flex items-center space-x-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tokens:</label>
                                    <input
                                        type="number"
                                        value={maxTokens}
                                        onChange={(e) => setMaxTokens(Number(e.target.value))}
                                        min="100"
                                        max={bedrockModels[selectedModel].maxTokens}
                                        disabled={!isAuthenticated}
                                        className="w-20 px-2 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-slate-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>

                                {/* User Profile */}
                                <UserProfile />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Controls - Collapsible */}
                    <div className="lg:hidden mt-3 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Model Selector */}
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Model:</label>
                                <select
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value as ModelKey)}
                                    disabled={!isAuthenticated}
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-slate-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {getModelsByCategory(selectedCategory).map(([key, model]) => (
                                        <option key={key} value={key}>
                                            {model.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Max Tokens */}
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Max Tokens:</label>
                                <input
                                    type="number"
                                    value={maxTokens}
                                    onChange={(e) => setMaxTokens(Number(e.target.value))}
                                    min="100"
                                    max={bedrockModels[selectedModel].maxTokens}
                                    disabled={!isAuthenticated}
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-slate-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 md:p-6">
                    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
                        {messages.length === 0 ? (
                            <div className="text-center py-8 md:py-16 animate-fadeIn">
                                <div className="p-3 md:p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl md:rounded-2xl w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 flex items-center justify-center shadow-xl">
                                    <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-white animate-pulse-soft" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 md:mb-3">
                                    Welcome to BongoAI
                                </h3>
                                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6 md:mb-8 px-4">
                                    {isAuthenticated
                                        ? 'Choose a category and start creating with AWS Bedrock models. Generate text, images, or videos with AI.'
                                        : 'Please sign in to start using BongoAI and create amazing content with AI.'
                                    }
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto px-4">
                                    <div className="p-4 md:p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-soft border border-slate-200/50 dark:border-slate-700/50">
                                        <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
                                            <Zap className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                                            <h4 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100">
                                                {bedrockModels[selectedModel].name}
                                            </h4>
                                        </div>
                                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">{bedrockModels[selectedModel].description}</p>
                                    </div>
                                    <div className="p-4 md:p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-soft border border-slate-200/50 dark:border-slate-700/50">
                                        <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
                                            <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${selectedCategory === 'text' ? 'bg-blue-600' :
                                                selectedCategory === 'image' ? 'bg-purple-600' : 'bg-emerald-600'
                                                }`}></div>
                                            <h4 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100">
                                                {modelCategories[selectedCategory]}
                                            </h4>
                                        </div>
                                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                                            Max Tokens: {bedrockModels[selectedModel].maxTokens}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                                >
                                    <div className={`flex max-w-[85%] sm:max-w-[75%] md:max-w-3xl ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-2 md:ml-4' : 'mr-2 md:mr-4'}`}>
                                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shadow-soft ${message.role === 'user'
                                                ? 'bg-gradient-to-br from-blue-600 to-purple-600'
                                                : 'bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-700 dark:to-slate-800'
                                                }`}>
                                                {message.role === 'user' ? (
                                                    <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                                ) : (
                                                    <Bot className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                                )}
                                            </div>
                                        </div>
                                        <div className={`relative group ${message.role === 'user'
                                            ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                                            : 'bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 backdrop-blur-sm'
                                            } rounded-xl md:rounded-2xl px-3 py-3 md:px-6 md:py-4 shadow-elegant border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-200`}>

                                            {/* Image preview if present */}
                                            {message.imageUrl && (
                                                <div className="mb-3 md:mb-4">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={message.imageUrl}
                                                        alt="Uploaded content"
                                                        className="max-w-full h-auto rounded-lg md:rounded-xl max-h-48 md:max-h-64 object-cover shadow-soft"
                                                    />
                                                </div>
                                            )}

                                            <div className="prose prose-sm max-w-none">
                                                <pre className="whitespace-pre-wrap font-sans text-xs md:text-sm leading-relaxed">{message.content}</pre>
                                            </div>

                                            {message.role === 'assistant' && (
                                                <div className="flex items-center justify-between mt-3 md:mt-4 pt-2 md:pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{message.model}</span>
                                                    <button
                                                        onClick={() => copyToClipboard(message.content, message.id)}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 md:p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md md:rounded-lg"
                                                    >
                                                        {copiedId === message.id ? (
                                                            <Check className="w-3 h-3 md:w-4 md:h-4 text-emerald-600" />
                                                        ) : (
                                                            <Copy className="w-3 h-3 md:w-4 md:h-4 text-slate-500 dark:text-slate-400" />
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                        {isLoading && (
                            <div className="flex justify-start animate-fadeIn">
                                <div className="flex max-w-[85%] sm:max-w-[75%] md:max-w-3xl">
                                    <div className="flex-shrink-0 mr-2 md:mr-4">
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center shadow-soft">
                                            <Bot className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                        </div>
                                    </div>
                                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl md:rounded-2xl px-3 py-3 md:px-6 md:py-4 shadow-elegant border border-slate-200/50 dark:border-slate-700/50">
                                        <div className="flex items-center space-x-2 md:space-x-3">
                                            <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin text-blue-600" />
                                            <span className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                                                Generating {selectedCategory}...
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Input Area */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50 p-3 md:p-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Image Preview */}
                        {uploadedImage && (
                            <div className="mb-3 md:mb-4 relative inline-block animate-fadeIn">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={uploadedImage}
                                    alt="Uploaded preview"
                                    className="max-h-24 md:max-h-32 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-700 shadow-soft"
                                />
                                <button
                                    onClick={() => setUploadedImage(null)}
                                    disabled={!isAuthenticated}
                                    className="absolute -top-1 -right-1 md:-top-2 md:-right-2 p-1 md:p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg disabled:cursor-not-allowed"
                                >
                                    <X className="w-2 h-2 md:w-3 md:h-3" />
                                </button>
                            </div>
                        )}

                        <div className="relative">
                            <div className="relative bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl shadow-elegant border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                    disabled={!isAuthenticated}
                                    placeholder={isAuthenticated
                                        ? `Type your ${selectedCategory === 'text' ? 'message' : `${selectedCategory} prompt`}... (Press Enter to send, Shift+Enter for new line)`
                                        : 'Please sign in to start chatting...'
                                    }
                                    className="w-full px-3 py-3 md:px-6 md:py-4 pr-16 md:pr-24 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 resize-none focus:outline-none rounded-xl md:rounded-2xl text-sm md:text-base disabled:cursor-not-allowed disabled:opacity-50"
                                    rows={1}
                                    style={{ minHeight: '48px', maxHeight: '150px' }}
                                />

                                <div className="absolute right-1 bottom-1 md:right-2 md:bottom-2 flex items-center space-x-1 md:space-x-2">
                                    {/* Image Upload Button */}
                                    {(selectedCategory === 'image' || selectedCategory === 'video') && (
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={!isAuthenticated}
                                            className="p-2 md:p-2.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg md:rounded-xl transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                                            title="Upload image"
                                        >
                                            <Upload className="w-4 h-4 md:w-5 md:h-5" />
                                        </button>
                                    )}

                                    <button
                                        onClick={sendMessage}
                                        disabled={(!input.trim() && !uploadedImage) || isLoading || !isAuthenticated}
                                        className="p-2 md:p-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-lg md:rounded-xl disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:hover:scale-100 shadow-lg"
                                    >
                                        <Send className="w-4 h-4 md:w-5 md:h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
            </div>
        </div>
    );
} 