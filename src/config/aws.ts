export const awsConfig = {
    region: process.env.AWS_REGION || 'us-east-1',
    bearerToken: process.env.AWS_BEARER_TOKEN_BEDROCK,
};

export const modelCategories = {
    text: 'Text Generation',
    image: 'Image Generation',
    video: 'Video Generation'
} as const;

export type CategoryKey = keyof typeof modelCategories;

export const bedrockModels = {
    // Text Generation Models
    'claude-opus-4': {
        id: 'anthropic.claude-opus-4-20250514-v1:0',
        name: 'Claude Opus 4',
        description: 'Most advanced model with hybrid reasoning and extended thinking',
        maxTokens: 8192,
        category: 'text' as CategoryKey,
        type: 'text',
    },
    'claude-sonnet-4': {
        id: 'anthropic.claude-sonnet-4-20250514-v1:0',
        name: 'Claude Sonnet 4',
        description: 'Advanced model with efficient code generation and text generation',
        maxTokens: 8192,
        category: 'text' as CategoryKey,
        type: 'text',
    },
    'claude-3-7-sonnet': {
        id: 'anthropic.claude-3-7-sonnet-20250219-v1:0',
        name: 'Claude 3.7 Sonnet',
        description: 'Enhanced version of Claude 3 with improved capabilities',
        maxTokens: 8192,
        category: 'text' as CategoryKey,
        type: 'text',
    },
    // Image Generation Models
    'nova-canvas': {
        id: 'amazon.nova-canvas-v1:0',
        name: 'Nova Canvas',
        description: 'Image-to-image generation and editing',
        maxTokens: 1024,
        category: 'image' as CategoryKey,
        type: 'image',
    },
    // Video Generation Models
    'nova-reel': {
        id: 'amazon.nova-reel-v1:0',
        name: 'Nova Reel',
        description: 'Text-to-video and image-to-video generation',
        maxTokens: 1024,
        category: 'video' as CategoryKey,
        type: 'video',
    },
};

export type ModelKey = keyof typeof bedrockModels;

export const getModelsByCategory = (category: CategoryKey) => {
    return Object.entries(bedrockModels).filter(([, model]) => model.category === category);
}; 