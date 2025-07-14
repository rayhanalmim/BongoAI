# 🤖 Bedrock AI Client - Multi-Modal AI Assistant

A beautiful, professional multi-modal AI client for AWS Bedrock models built with Next.js, TypeScript, and Tailwind CSS. Generate text, images, and videos with cutting-edge AI models.

## ✨ Features

### 🎯 **Multi-Modal AI Generation**
- **Text Generation**: Claude Opus 4, Claude Sonnet 4, Claude 3.7 Sonnet
- **Image Generation**: Amazon Nova Canvas (image-to-image, text-to-image)
- **Video Generation**: Amazon Nova Reel (text-to-video, image-to-video)

### 🎨 **Beautiful User Interface**
- **Modern Design**: Responsive interface with smooth animations
- **Left Sidebar**: ChatGPT-style conversation history
- **Category Selector**: Switch between Text, Image, and Video modes
- **Image Upload**: Drag & drop or click to upload images
- **Real-time Chat**: Interactive messaging with typing indicators

### 🚀 **Professional Features**
- **Multi-Conversation Management**: Create, switch, and delete conversations
- **Auto-Saving**: Conversations persist during your session
- **Copy to Clipboard**: Easy copying of AI responses
- **Model Selection**: Choose the best model for your task
- **Token Control**: Adjustable response length limits
- **Mobile Responsive**: Works perfectly on all devices

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd bedrock-client
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# AWS Bedrock Configuration
AWS_BEARER_TOKEN_BEDROCK=your_aws_bedrock_api_key_here
AWS_REGION=us-east-1
NEXT_PUBLIC_APP_NAME=Bedrock AI Client
```

**To get your AWS Bedrock API Key:**
1. Go to AWS Bedrock Console
2. Navigate to "API Keys" section
3. Generate a long-term API key
4. Copy the key and set it as `AWS_BEARER_TOKEN_BEDROCK`

### 3. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

### 📝 Text Generation Models

- **Claude Opus 4**: Most advanced model with hybrid reasoning (8192 tokens)
- **Claude Sonnet 4**: Efficient code generation and text generation (8192 tokens)  
- **Claude 3.7 Sonnet**: Enhanced capabilities for complex tasks (8192 tokens)

### 🖼️ Image Generation Models

- **Amazon Nova Canvas**: Advanced image-to-image and text-to-image generation
  - **Text-to-Image**: Generate images from text descriptions
  - **Image-to-Image**: Transform and edit existing images
  - **Resolution**: Up to 1024x1024 pixels

### 🎬 Video Generation Models

- **Amazon Nova Reel**: Cutting-edge video generation
  - **Text-to-Video**: Create videos from text descriptions
  - **Image-to-Video**: Animate static images into videos
  - **Duration**: Up to 6 seconds at 24fps
  - **Resolution**: 1280x720 (HD)

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `AWS_BEARER_TOKEN_BEDROCK` | Your AWS Bedrock API key | - | Yes |
| `AWS_REGION` | AWS region for Bedrock service | `us-east-1` | No |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Bedrock AI Client` | No |

## 🎯 Usage Guide

### 📱 **Interface Overview**

#### Left Sidebar
- **Conversations List**: All your chat histories organized by category
- **Category Selector**: Switch between Text, Image, Video modes
- **New Chat Button**: Create new conversations for different categories
- **Delete Conversations**: Remove unwanted chat histories

#### Main Chat Area
- **Model Selection**: Choose the best AI model for your task
- **Token Control**: Adjust response length (100 to 8192 tokens)
- **Message Input**: Type prompts with image upload support
- **Response Display**: View generated text, images, or videos

### 🎨 **Text Generation**
1. Select **"Text"** category
2. Choose your preferred Claude model
3. Type your message or question
4. Press Enter or click Send
5. Copy responses with one click

### 🖼️ **Image Generation**
1. Select **"Image"** category  
2. Choose **Nova Canvas** model
3. **Text-to-Image**: Type a description (e.g., "A sunset over mountains")
4. **Image-to-Image**: Upload an image + add instructions
5. Click Send to generate
6. Download or copy generated images

### 🎬 **Video Generation**
1. Select **"Video"** category
2. Choose **Nova Reel** model  
3. **Text-to-Video**: Describe the video you want
4. **Image-to-Video**: Upload an image to animate
5. Generate 6-second HD videos
6. Download generated videos

### ⌨️ **Keyboard Shortcuts**
- **Enter**: Send message
- **Shift + Enter**: New line in message input
- **Cmd/Ctrl + N**: New conversation

## 🏗️ Project Structure

```
bedrock-client/
├── src/
│   ├── app/
│   │   ├── api/chat/          # Multi-modal API routes
│   │   ├── layout.tsx         # Root layout with toast provider
│   │   └── page.tsx          # Main application page
│   ├── components/
│   │   └── ChatInterface.tsx  # Multi-modal chat interface
│   └── config/
│       └── aws.ts            # AWS models and categories config
├── .env.local                # Environment variables
├── README.md                # This comprehensive guide
└── USAGE.md                 # Detailed usage instructions
```

## 🔐 Security & Privacy

- **No Data Storage**: Conversations are not saved server-side
- **Secure Transmission**: All API calls use HTTPS encryption
- **Local Processing**: UI runs entirely in your browser
- **API Key Protection**: Credentials only accessible server-side
- **Session-Only Storage**: Chat history cleared on browser close

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy instantly!

### Other Platforms

Deploy to any Node.js hosting platform:
- Netlify
- Railway  
- Digital Ocean App Platform
- AWS Amplify
- Heroku

## 🛠️ Development

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **File Handling**: Native File API
- **State Management**: React Hooks

### Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🎨 UI/UX Features

### Modern Design Elements
- **Gradient Backgrounds**: Beautiful color transitions
- **Smooth Animations**: Hover effects and transitions
- **Responsive Layout**: Mobile-first design approach
- **Dark/Light Modes**: Clean interface in both themes
- **Professional Typography**: Optimized readability

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Compatible**: ARIA labels and semantic HTML
- **High Contrast**: Clear visual hierarchy
- **Touch Friendly**: Mobile gesture support

## 🔧 Advanced Features

### Multi-Modal Prompting
- **Combined Inputs**: Use text + image for better results
- **Context Awareness**: Models understand previous conversation
- **Smart Suggestions**: Category-specific prompt guidance

### Conversation Management
- **Auto-Titling**: Conversations named from first message
- **Category Organization**: Separate histories for each type
- **Quick Switching**: Jump between conversations instantly
- **Bulk Operations**: Delete multiple conversations

### Performance Optimization
- **Lazy Loading**: Components load as needed
- **Image Optimization**: Automatic compression and resizing
- **Caching**: Smart API response caching
- **Progressive Enhancement**: Works without JavaScript

## 📝 API Integration Details

### Request Formats

**Text Generation (Claude)**:
```json
{
  "anthropic_version": "bedrock-2023-05-31",
  "max_tokens": 1000,
  "messages": [{"role": "user", "content": "Your message"}]
}
```

**Image Generation (Nova Canvas)**:
```json
{
  "taskType": "TEXT_IMAGE",
  "textToImageParams": {"text": "Your prompt"},
  "imageGenerationConfig": {
    "numberOfImages": 1,
    "quality": "standard",
    "height": 1024,
    "width": 1024
  }
}
```

**Video Generation (Nova Reel)**:
```json
{
  "taskType": "TEXT_TO_VIDEO", 
  "textToVideoParams": {"text": "Your prompt"},
  "videoGenerationConfig": {
    "durationSeconds": 6,
    "fps": 24,
    "dimension": "1280x720"
  }
}
```

## 🆘 Troubleshooting

### Common Issues

**"Model identifier is invalid"**
- Check your AWS Bedrock model access
- Verify your API key has permissions for the selected models
- Try different models to identify access issues

**Image upload not working**
- Ensure you're in Image or Video category
- Check file size (max 10MB recommended)
- Verify image format (JPG, PNG, WebP supported)

**Slow generation**
- Reduce token count for faster responses
- Try different models (Claude Sonnet 4 is faster)
- Check your internet connection

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🌟 Features Roadmap

### Coming Soon
- [ ] **Dark Mode**: Toggle between light and dark themes
- [ ] **Export Conversations**: Download chat histories as PDF/JSON
- [ ] **Advanced Image Editing**: In-browser image manipulation
- [ ] **Video Player**: Built-in video playback controls
- [ ] **Collaborative Sharing**: Share conversations with team
- [ ] **Custom System Prompts**: Pre-defined prompt templates
- [ ] **Usage Analytics**: Track token usage and costs
- [ ] **Batch Processing**: Generate multiple items at once

### Advanced Features
- [ ] **Voice Input**: Speech-to-text for prompts
- [ ] **Real-time Collaboration**: Multiple users in same chat
- [ ] **Plugin System**: Custom model integrations
- [ ] **Workflow Automation**: Chain multiple AI operations
- [ ] **Cloud Storage**: Persistent conversation storage

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **AWS Bedrock**: For providing cutting-edge AI models
- **Anthropic**: For the Claude family of language models
- **Amazon**: For Nova Canvas and Reel generation models
- **Next.js Team**: For the amazing React framework
- **Tailwind CSS**: For the utility-first CSS framework

---

**🚀 Ready to explore the future of AI? Start generating with Bedrock AI Client!**

Built with ❤️ using AWS Bedrock, Next.js, and the latest AI technologies.
