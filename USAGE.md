# 📖 Bedrock AI Client - Usage Guide

## 🚀 Getting Started

1. **Open the application** at `http://localhost:3000`
2. **Select a model** from the dropdown in the header
3. **Adjust token settings** if needed
4. **Start chatting** with the AI!

## 🎛️ Interface Overview

### Header Controls

- **Model Selector**: Switch between Claude 3.5 Sonnet, Claude 3 Haiku, Amazon Titan, and Meta Llama models
- **Token Control**: Set the maximum number of tokens for responses (100 to model maximum)
- **Clear Chat**: Reset the conversation history

### Chat Interface

- **Message Bubbles**: 
  - 🟦 Blue bubbles for your messages (right side)
  - ⚪ White bubbles for AI responses (left side)
- **Copy Feature**: Hover over AI responses to reveal copy button
- **Model Attribution**: See which model generated each response
- **Loading Indicator**: Shows when AI is thinking

### Input Area

- **Textarea**: Type your messages
- **Send Button**: Click or press Enter to send
- **Keyboard Shortcuts**:
  - `Enter`: Send message
  - `Shift + Enter`: New line

## 🤖 Available Models

### Claude 3.5 Sonnet
- **Best for**: Complex reasoning, analysis, creative writing
- **Max Tokens**: 8,192
- **Speed**: Moderate
- **Use cases**: Research, code review, detailed explanations

### Claude 3 Haiku
- **Best for**: Quick questions, simple tasks
- **Max Tokens**: 4,096
- **Speed**: Fast
- **Use cases**: Quick answers, simple coding help, casual chat

### Amazon Titan Text Express
- **Best for**: General text generation
- **Max Tokens**: 8,192
- **Speed**: Moderate
- **Use cases**: Content creation, summarization

### Meta Llama 3 70B
- **Best for**: Open-ended conversations, creative tasks
- **Max Tokens**: 2,048
- **Speed**: Moderate
- **Use cases**: Brainstorming, creative writing, general chat

## 💡 Tips for Best Results

### Prompt Engineering
- **Be specific**: Clear, detailed prompts get better responses
- **Provide context**: Give background information when needed
- **Use examples**: Show the AI what you want with examples
- **Set the role**: "Act as a [expert/teacher/assistant]..."

### Token Management
- **Short responses**: Use fewer tokens (100-500) for quick answers
- **Detailed analysis**: Use more tokens (1000+) for comprehensive responses
- **Iterative refinement**: Start with moderate tokens, adjust based on results

### Model Selection
- **Claude 3.5 Sonnet**: When you need the smartest, most capable responses
- **Claude 3 Haiku**: When you need fast, efficient answers
- **Titan**: For balanced performance and AWS ecosystem integration
- **Llama**: For open-source model capabilities and creative tasks

## 🔧 Advanced Features

### Copying Responses
1. Hover over any AI response
2. Click the copy icon that appears
3. Content is copied to your clipboard
4. Green checkmark confirms successful copy

### Managing Conversations
- **Clear Chat**: Removes all messages and starts fresh
- **Session Persistence**: Messages stay during your browser session
- **No Account Required**: Everything runs locally in your browser

### Token Optimization
- Monitor response length vs. token usage
- Adjust token limits based on your needs
- Higher tokens = longer, more detailed responses
- Lower tokens = concise, focused answers

## 🛠️ Troubleshooting

### Common Issues

**"AWS Bearer Token not configured"**
- Check your `.env.local` file
- Ensure `AWS_BEARER_TOKEN_BEDROCK` is set correctly
- Restart the development server

**"Failed to get response"**
- Verify your AWS Bedrock API key is valid
- Check you have access to the selected model
- Ensure your AWS region is correct

**Slow responses**
- Try a faster model (Claude 3 Haiku)
- Reduce token count
- Check your internet connection

**Copy not working**
- Ensure you're using a modern browser
- Check clipboard permissions
- Try right-click → copy as alternative

### Browser Compatibility
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 🔐 Privacy & Security

- **No data storage**: Conversations are not saved server-side
- **Secure transmission**: All API calls use HTTPS
- **Local processing**: UI runs entirely in your browser
- **API key protection**: Credentials only used server-side

## 📱 Mobile Support

The interface is fully responsive and works on:
- 📱 Smartphones (iOS/Android)
- 📱 Tablets
- 💻 Desktop computers
- 💻 Laptops

## 🎨 Customization

### Themes
Currently supports light theme with:
- Clean, professional design
- High contrast for readability
- Smooth animations and transitions

### Future Enhancements
- Dark mode toggle
- Custom color schemes
- Font size adjustments
- Layout preferences

## 📞 Getting Help

1. **Check this guide** for common questions
2. **Review the README.md** for setup issues
3. **Check browser console** for error messages
4. **Verify AWS credentials** and permissions

## 🌟 Pro Tips

1. **Experiment with models**: Each has unique strengths
2. **Use descriptive prompts**: Better input = better output
3. **Iterate and refine**: Build on previous responses
4. **Copy useful responses**: Save good outputs for later
5. **Adjust tokens dynamically**: Match response length to your needs

---

Happy chatting with AWS Bedrock! 🚀 