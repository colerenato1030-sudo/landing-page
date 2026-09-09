# OmniRoute Plugin Installation Guide

This landing page project includes the **OmniRoute plugin** — an advanced AI gateway that routes requests across 352+ LLM providers with intelligent fallback and compression.

## Quick Start

### 1. Prerequisites

- **Node.js 18+** — Download from [nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js)
- **API Keys** for at least one LLM provider:
  - [Anthropic (Claude)](https://console.anthropic.com)
  - [OpenAI](https://platform.openai.com/api-keys)
  - [Google Gemini](https://makersuite.google.com/app/apikey)

### 2. Install OmniRoute

```bash
npm install -g omniroute
```

Verify installation:

```bash
omniroute --version
```

### 3. Configure Environment

Create a `.env` file in the project root:

```bash
# Copy the template
cp .claude/plugins/omniroute/.env.example .env

# Edit with your API keys
nano .env
```

Or run the automated setup:

```bash
bash .claude/plugins/omniroute/setup.sh
```

### 4. Start the OmniRoute Server

```bash
omniroute server --port 8080
```

You should see:

```
✅ OmniRoute server listening on http://localhost:8080
🚀 Ready to route LLM requests
```

### 5. Verify It's Working

```bash
curl http://localhost:8080/health
```

Response:

```json
{
  "status": "healthy",
  "timestamp": "2026-09-09T10:00:00Z"
}
```

## Integration with This Project

The OmniRoute plugin is configured in `.claude/plugins/omniroute/`:

| File | Purpose |
|------|---------|
| `plugin.json` | Plugin metadata and capabilities |
| `config.json` | OmniRoute routing rules and providers |
| `README.md` | Comprehensive documentation |
| `setup.sh` | Automated installation script |

## Using OmniRoute with Claude Code

Once the server is running, Claude Code and scripts in this project can route AI requests through OmniRoute:

### API Endpoint

```
http://localhost:8080
```

### Model IDs

**Primary:**
- `claude-3-5-sonnet-20241022` (Anthropic)

**Fallback:**
- `claude-3-haiku-20240307` (Anthropic)

**Custom:**
- Any model supported by your configured providers

## Routing Strategy

OmniRoute uses **auto-fallback** by default:

1. Request sent to primary provider (Anthropic)
2. If timeout or error occurs, try next provider (OpenAI)
3. If all fail, try gemini provider
4. If all fail, return error

Each request can be configured with a custom provider order.

## Advanced Configuration

### Custom Provider Priority

Edit `.claude/plugins/omniroute/config.json`:

```json
"providers": {
  "anthropic": { "enabled": true, "priority": 1 },
  "openai": { "enabled": true, "priority": 2 },
  "gemini": { "enabled": true, "priority": 3 }
}
```

### Context Compression

Enable RTK+Caveman compression to reduce token usage:

```json
"features": {
  "compression": {
    "enabled": true,
    "algorithm": "rtk+caveman"
  }
}
```

### Request Caching

Cache responses to avoid duplicate API calls:

```json
"features": {
  "cacheing": {
    "enabled": true,
    "ttl": 3600
  }
}
```

## Troubleshooting

### OmniRoute server won't start

```bash
# Check if port 8080 is already in use
lsof -i :8080

# Try a different port
omniroute server --port 8081
```

### Missing API key errors

```bash
# Verify environment variables
echo $ANTHROPIC_API_KEY
echo $OPENAI_API_KEY

# Load from .env file
source .env
```

### Health check fails

```bash
# Check server logs
omniroute server --port 8080 --verbose

# Verify connectivity
curl -v http://localhost:8080/health
```

## Documentation

- **OmniRoute Official:** https://omniroute.online
- **GitHub Repository:** https://github.com/diegosouzapw/OmniRoute
- **API Documentation:** https://omniroute.online/docs/api

## Support

For issues or questions:

1. Check the [OmniRoute GitHub Issues](https://github.com/diegosouzapw/OmniRoute/issues)
2. Review the [OmniRoute Documentation](https://omniroute.online/docs)
3. Open an issue in this repository

## Next Steps

1. ✅ Install OmniRoute
2. ✅ Configure API keys
3. ✅ Start the server
4. 🔄 Test the routing
5. 🚀 Deploy to production

Run the setup script to automate steps 1-2:

```bash
bash .claude/plugins/omniroute/setup.sh
```

Happy routing! 🎯
