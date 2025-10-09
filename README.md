# AI Agents in Production

A production-ready AI agent framework built with TypeScript and OpenAI, featuring tool execution, memory management, RAG capabilities, and comprehensive evaluation system.

## Features

- **🤖 Intelligent Agent Framework**: Autonomous agent with tool calling and conversation memory
- **🛠️ Extensible Tool System**: Built-in tools for image generation, Reddit integration, dad jokes, and movie search
- **🧠 RAG (Retrieval Augmented Generation)**: Vector database integration with Upstash for semantic search over IMDB dataset
- **📊 Evaluation System**: Automated testing with scoring using the `autoevals` library
- **📈 Analytics Dashboard**: React-based visualization for experiment results and performance metrics
- **💾 Persistent Memory**: Conversation history storage with LowDB

## Architecture

```
.
├── src/
│   ├── agent.ts          # Main agent loop and orchestration
│   ├── llm.ts            # OpenAI LLM integration
│   ├── memory.ts         # Conversation history management
│   ├── toolRunner.ts     # Tool execution engine
│   ├── ui.ts             # CLI interface utilities
│   ├── systemPrompt.ts   # Agent system instructions
│   ├── tools/            # Tool implementations
│   │   ├── dadJoke.ts
│   │   ├── generateImage.ts
│   │   ├── movieSearch.ts
│   │   └── reddit.ts
│   └── rag/              # RAG system
│       ├── ingest.ts     # Vector database ingestion
│       ├── query.ts      # Semantic search
│       └── imdb_movie_dataset.csv
├── evals/                # Evaluation framework
│   ├── run.ts           # Test runner
│   ├── evalTools.ts     # Evaluation utilities
│   └── scorers.ts       # Scoring functions
├── dashboard/           # React visualization app
└── index.ts            # CLI entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ or Bun runtime
- OpenAI API key
- Upstash Vector Database account (optional, for RAG features)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd agents-in-production
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
OPENAI_API_KEY="your-openai-api-key"
```

### Usage

#### Run the Agent

```bash
npm start "your message here"
```

Example:
```bash
npm start "tell me a dad joke"
npm start "generate an image of a sunset"
npm start "what's trending on reddit?"
```

#### Run Evaluations

```bash
npm run eval
```

This will execute the evaluation suite and store results in `db.json`.

#### Ingest Data for RAG

```bash
npm run ingest
```

Ingests the IMDB movie dataset into the vector database for semantic search.

#### View Dashboard

```bash
cd dashboard
npm install
npm run dev
```

Access the dashboard at `http://localhost:5173` to visualize experiment results.

## Tools

The agent comes with several built-in tools:

- **generateImage**: Create images using DALL-E 3
- **reddit**: Fetch trending posts from subreddits
- **dadJoke**: Get random dad jokes
- **movieSearch**: Semantic search over IMDB dataset using RAG

## Adding Custom Tools

Create a new tool in `src/tools/`:

```typescript
import { z } from 'zod'

const myToolSchema = z.object({
  param: z.string().describe('Parameter description')
})

export const myToolDefinition = {
  type: 'function',
  function: {
    name: 'myTool',
    description: 'What your tool does',
    parameters: zodToJsonSchema(myToolSchema)
  }
}

export const myTool = async ({ toolArgs }: { toolArgs: z.infer<typeof myToolSchema> }) => {
  // Implementation
  return result
}
```

Register it in `src/tools/index.ts`:

```typescript
export const tools = [
  // ... existing tools
  myToolDefinition
]
```

## Evaluation System

The project includes a comprehensive evaluation framework:

- **Test Cases**: Define input/expected output pairs
- **Scorers**: Multiple scoring functions (LLM-based, similarity, etc.)
- **Tracking**: Store results with timestamps for comparison
- **Visualization**: Dashboard graphs for performance trends

## Tech Stack

- **Runtime**: Node.js / Bun with TypeScript
- **LLM**: OpenAI GPT-4
- **Vector DB**: Upstash Vector
- **Storage**: LowDB (JSON file database)
- **UI**: React + TypeScript + Vite
- **Eval**: Autoevals library
- **Tools**: Zod for schema validation

## Project Structure

- `src/agent.ts`: Core agent loop with tool execution
- `src/llm.ts`: OpenAI API wrapper
- `src/memory.ts`: Conversation history management
- `src/toolRunner.ts`: Dynamic tool execution
- `types.ts`: TypeScript type definitions
- `evals/`: Testing and evaluation framework
- `dashboard/`: React app for result visualization

## Development

The agent follows a simple loop:
1. User provides input
2. LLM generates response or tool calls
3. Tools execute and return results
4. Results added to conversation context
5. Loop continues until final response

Memory is persisted in `db.json` and can be cleared between sessions.

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a pull request.
