#!/bin/bash
# OmniRoute Plugin Setup Script for Claude Code

set -e

echo "🚀 OmniRoute Plugin Setup"
echo "========================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "   Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm $(npm --version) detected"
echo ""

# Install OmniRoute
echo "📦 Installing OmniRoute..."
if npm list -g omniroute &> /dev/null; then
    echo "✅ OmniRoute is already installed globally"
    omniroute --version
else
    echo "   Installing omniroute package..."
    npm install -g omniroute
    echo "✅ OmniRoute installed successfully"
fi

echo ""

# Check for API keys
echo "🔑 Checking for required API keys..."
echo ""

check_env_var() {
    local var_name=$1
    local provider=$2

    if [ -z "${!var_name}" ]; then
        echo "⚠️  $provider API key not set ($var_name)"
        return 1
    else
        echo "✅ $provider API key configured"
        return 0
    fi
}

check_env_var "ANTHROPIC_API_KEY" "Anthropic"
check_env_var "OPENAI_API_KEY" "OpenAI"
check_env_var "GEMINI_API_KEY" "Google Gemini"

echo ""
echo "📝 Configuration"
echo "================"
echo "Plugin config: $(pwd)/config.json"
echo "Default endpoint: http://localhost:8080"
echo ""

# Offer to create .env file
echo "💾 Would you like to create a .env file for API keys? (y/n)"
read -r create_env

if [[ "$create_env" =~ ^[Yy]$ ]]; then
    cat > .env << 'EOF'
# OmniRoute Plugin Environment Variables

# Anthropic API Key (https://console.anthropic.com)
ANTHROPIC_API_KEY=sk-ant-...

# OpenAI API Key (https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-...

# Google Gemini API Key (https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=...

# OmniRoute Server Configuration
OMNIROUTE_PORT=8080
OMNIROUTE_LOG_LEVEL=info
EOF
    echo "✅ .env file created at $(pwd)/.env"
    echo "   ⚠️  Don't commit this file to git! Add it to .gitignore."
fi

echo ""
echo "🚀 Starting OmniRoute Server"
echo "============================"
echo ""
echo "To start the OmniRoute server, run:"
echo ""
echo "  omniroute server --port 8080"
echo ""
echo "The server will be available at: http://localhost:8080"
echo ""
echo "Check health status:"
echo "  curl http://localhost:8080/health"
echo ""
echo "List available models:"
echo "  curl http://localhost:8080/v1/models"
echo ""

# Offer to start the server
echo "Would you like to start the OmniRoute server now? (y/n)"
read -r start_server

if [[ "$start_server" =~ ^[Yy]$ ]]; then
    if [ -f .env ]; then
        source .env
    fi
    echo "Starting OmniRoute server..."
    omniroute server --port "${OMNIROUTE_PORT:-8080}" --log-level "${OMNIROUTE_LOG_LEVEL:-info}"
else
    echo "Setup complete! Run 'omniroute server --port 8080' to start."
fi
