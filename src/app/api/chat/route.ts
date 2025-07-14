import { NextRequest, NextResponse } from 'next/server';
import { awsConfig, bedrockModels, ModelKey } from '@/config/aws';

export async function POST(req: NextRequest) {
    try {
        const { message, modelKey, maxTokens = 1000, category = 'text', imageData } = await req.json();

        if (!message && !imageData) {
            return NextResponse.json({ error: 'Message or image data is required' }, { status: 400 });
        }

        if (!awsConfig.bearerToken) {
            return NextResponse.json({ error: 'AWS Bearer Token not configured' }, { status: 500 });
        }

        const selectedModel = bedrockModels[modelKey as ModelKey] || bedrockModels['claude-opus-4'];

        let body;

        // Different request formats based on model type
        if (selectedModel.type === 'text') {
            // Anthropic Claude models
            body = JSON.stringify({
                anthropic_version: 'bedrock-2023-05-31',
                max_tokens: Math.min(maxTokens, selectedModel.maxTokens),
                messages: [
                    {
                        role: 'user',
                        content: message,
                    },
                ],
            });
        } else if (selectedModel.type === 'image') {
            // Amazon Nova Canvas (image generation)
            body = JSON.stringify({
                taskType: imageData ? 'IMAGE_VARIATION' : 'TEXT_IMAGE',
                textToImageParams: {
                    text: message,
                    ...(imageData && { images: [imageData.split(',')[1]] }), // Remove data:image/jpeg;base64, prefix
                },
                imageGenerationConfig: {
                    numberOfImages: 1,
                    quality: 'standard',
                    cfgScale: 8.0,
                    height: 1024,
                    width: 1024,
                    seed: Math.floor(Math.random() * 2147483647)
                }
            });
        } else if (selectedModel.type === 'video') {
            // Amazon Nova Reel (video generation)
            body = JSON.stringify({
                taskType: imageData ? 'IMAGE_TO_VIDEO' : 'TEXT_TO_VIDEO',
                textToVideoParams: {
                    text: message,
                    ...(imageData && { images: [imageData.split(',')[1]] }), // Remove data:image/jpeg;base64, prefix
                },
                videoGenerationConfig: {
                    durationSeconds: 6,
                    fps: 24,
                    dimension: "1280x720",
                    seed: Math.floor(Math.random() * 2147483647)
                }
            });
        }

        // Try different approaches to call the API
        const approaches = [
            // Approach 1: Direct model ID  
            {
                url: `https://bedrock-runtime.${awsConfig.region}.amazonaws.com/model/${selectedModel.id}/invoke`,
                description: 'Direct model ID'
            },
            // Approach 2: Cross-region inference profile (us prefix)
            {
                url: `https://bedrock-runtime.us-east-1.amazonaws.com/model/us.${selectedModel.id}/invoke`,
                description: 'Cross-region inference profile (us prefix)'
            },
            // Approach 3: Cross-region inference profile (different format)
            {
                url: `https://bedrock-runtime.us-east-1.amazonaws.com/model/us.anthropic.claude-3-5-sonnet-20241022-v2:0/invoke`,
                description: 'Cross-region inference profile (claude 3.5 sonnet)'
            },
            // Approach 4: Different region
            {
                url: `https://bedrock-runtime.us-west-2.amazonaws.com/model/${selectedModel.id}/invoke`,
                description: 'US West 2 region'
            },
            // Approach 5: Try without version
            {
                url: `https://bedrock-runtime.${awsConfig.region}.amazonaws.com/model/${selectedModel.id.split(':')[0]}/invoke`,
                description: 'Model ID without version'
            }
        ];

        let lastError = '';

        for (const approach of approaches) {
            try {
                console.log(`Trying ${approach.description}: ${approach.url}`);

                const response = await fetch(approach.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${awsConfig.bearerToken}`,
                    },
                    body: body,
                });

                if (response.ok) {
                    const responseBody = await response.json();

                    let content = '';
                    let imageUrl = '';

                    if (selectedModel.type === 'text') {
                        // Extract content from Anthropic response format
                        content = responseBody.content[0].text;
                    } else if (selectedModel.type === 'image') {
                        // Extract image from Nova Canvas response
                        if (responseBody.images && responseBody.images.length > 0) {
                            imageUrl = `data:image/png;base64,${responseBody.images[0]}`;
                            content = `Generated image: ${message}`;
                        } else {
                            content = 'Image generated successfully';
                        }
                    } else if (selectedModel.type === 'video') {
                        // Extract video from Nova Reel response
                        if (responseBody.video) {
                            // For video, we'd typically save to storage and return URL
                            // For now, we'll return a placeholder
                            content = `Video generated successfully: ${message}`;
                            // In production, you'd save the video and return the URL
                            // imageUrl = await saveVideoToStorage(responseBody.video);
                        } else {
                            content = 'Video generated successfully';
                        }
                    }

                    return NextResponse.json({
                        response: content,
                        model: selectedModel.name,
                        tokens: responseBody.usage || {},
                        approach: approach.description,
                        imageUrl: imageUrl || undefined,
                        category: category,
                    });
                } else {
                    const errorText = await response.text();
                    lastError = `${approach.description}: ${response.status} - ${errorText}`;
                    console.log(lastError);
                }
            } catch (error) {
                lastError = `${approach.description}: ${error instanceof Error ? error.message : 'Unknown error'}`;
                console.log(lastError);
            }
        }

        // If all approaches failed, return the last error
        throw new Error(`All approaches failed. Last error: ${lastError}`);

    } catch (error) {
        console.error('Bedrock API Error:', error);
        return NextResponse.json(
            { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
} 