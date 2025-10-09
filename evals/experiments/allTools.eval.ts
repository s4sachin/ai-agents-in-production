import { runLLM } from '../../src/llm'
import { dadJokeToolDefinition } from '../../src/tools/dadJoke'
import { redditToolDefinition } from '../../src/tools/reddit'
import { generateImageToolDefinition } from '../../src/tools/generateImage'
import { runEval } from '../evalTools'
import { ToolCallMatch } from '../scorers'

const createToolCallMessage = (toolName: string) => {
  return {
    role: 'assistant',
    tool_calls: [
      {
        type: 'function',
        function: { name: toolName },
      },
    ],
  }
}

const allTools = [
  dadJokeToolDefinition,
  redditToolDefinition,
  generateImageToolDefinition,
]

runEval('allTools', {
  task: (input) =>
    runLLM({
      messages: [{ role: 'user', content: input }],
      tools: allTools,
    }),
  data: [
    {
      input: 'tell me something interesting from reddit',
      expected: createToolCallMessage(redditToolDefinition.name),
    },
    {
      input: 'tell me a funny dad joke',
      expected: createToolCallMessage(dadJokeToolDefinition.name),
    },
    {
      input: 'generate an image of a sunset over a mountain range',
      expected: createToolCallMessage(generateImageToolDefinition.name),
    },
  ],
  scorers: [ToolCallMatch],
})
