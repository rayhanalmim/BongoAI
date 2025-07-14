#!/bin/bash

echo "🤖 Setting up AWS Bedrock AI Client..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚙️  Creating environment file..."
    echo "# AWS Bedrock Configuration" > .env.local
    echo "AWS_BEARER_TOKEN_BEDROCK=your_aws_bedrock_api_key_here" >> .env.local
    echo "AWS_REGION=us-east-1" >> .env.local
    echo "NEXT_PUBLIC_APP_NAME=Bedrock AI Client" >> .env.local
    echo "📝 Please edit .env.local and add your AWS Bedrock API key"
else
    echo "✅ Environment file already exists"
fi

echo "🚀 Setup complete! To start the development server, run:"
echo "   npm run dev"
echo ""
echo "📝 Don't forget to:"
echo "   1. Add your AWS Bedrock API key to .env.local"
echo "   2. Ensure you have access to the Bedrock models you want to use"
echo ""
echo "🌐 The app will be available at http://localhost:3000" 