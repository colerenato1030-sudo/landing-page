# OmniRoute Plugin for Claude Code

This plugin integrates **OmniRoute** — a unified AI gateway with 352+ providers and intelligent fallback — into your Claude Code workflows.

## What is OmniRoute?

OmniRoute is a powerful AI routing gateway that:
- Routes requests across 352+ LLM providers (Anthropic, OpenAI, Gemini, Cohere, Hugging Face, etc.)
- Automatically falls back to alternative models if the primary fails
- Compresses context using RTK+Caveman compression
- Supports MCP (Model Context Protocol) and A2A (Agent-to-Agent) communication
- Offers desktop, PWA, and server deployment options

**Official site:** https://omniroute.online  
**GitHub:** https://github.com/diegosouzapw/OmniRoute

## Installation

### Prerequisites
- Node.js 18+ (recommended)
- Docker (optional, for containerized deployment)

### Install OmniRoute Globally

```bash
npm install -g omniroute
```

### Start the OmniRoute Server

```bash
omniroute server --port 8080
```

The server will be available at `http://localhost:8080`.

## Configuration

The plugin configuration is defined in `config.json`:

- **Primary Model:** `claude-3-5-sonnet-20241022` (Anthropic)
- **Fallback Model:** `claude-3-haiku-20240307`
- **Health Check:** Every 60 seconds
- **Auto-Retry:** Up to 3 attempts with fallback routing
- **Timeout:** 30 seconds per request

### Environment Variables

Set these before running:

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
export OPENAI_API_KEY="sk-..."
export GEMINI_API_KEY="..."
```

## Usage

### In Claude Code

Once installed and configured, OmniRoute handles all LLM routing transparently:

1. Claude Code detects the omniroute plugin
2. Requests route through the OmniRoute gateway
3. If the primary provider fails, it automatically falls back
4. Responses are logged and cached for efficiency

### Direct API Calls

You can also call the OmniRoute API directly:

```bash
curl -X POST http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### Features

✅ **Auto-Fallback:** Seamlessly switches providers  
✅ **Context Compression:** RTK+Caveman reduces token usage  
✅ **Health Monitoring:** Tracks provider availability  
✅ **Request Caching:** Avoids redundant API calls  
✅ **Comprehensive Logging:** JSON-formatted logs for debugging  

## Troubleshooting

### OmniRoute Server Not Responding

```bash
# Check if the server is running
curl http://localhost:8080/health

# Restart the server
omniroute server --port 8080 --verbose
```

### Missing API Keys

Ensure all required environment variables are set:

```bash
echo $ANTHROPIC_API_KEY
echo $OPENAI_API_KEY
```

### Model Not Found

Check available models:

```bash
curl http://localhost:8080/v1/models
```

## Advanced Configuration

### Custom Provider Priority

Edit `config.json` to adjust provider order:

```json
"providers": {
  "anthropic": { "priority": 1 },
  "openai": { "priority": 2 },
  "gemini": { "priority": 3 }
}
```

### Docker Deployment

```bash
docker run -p 8080:8080 \
  -e ANTHROPIC_API_KEY="sk-ant-..." \
  -e OPENAI_API_KEY="sk-..." \
  diegosouza/omniroute:latest
```

## Support

- **Issues:** https://github.com/diegosouzapw/OmniRoute/issues
- **Documentation:** https://omniroute.online/docs
- **Community:** OmniRoute Discord & GitHub Discussions

## License

MIT — See OmniRoute repository for details.
