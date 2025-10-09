import { runLLM } from "../../src/llm";
import { redditToolDefinition } from "../../src/tools/reddit";
import { runEval } from "../evalTools";
import { ToolCallMatch } from "../scorers";

const createToolCallMessage = (toolName: string) => {
    return {
        role: 'assistant',
        tool_calls: [
            {
                type: 'function',
                function: { name: toolName}
            }
        ]
    }
}

runEval('reddit', {
    task: (input) => runLLM({
        messages: [{role: 'user', content: input}],
        tools: [redditToolDefinition]
    }),
    data: [{
        input: 'find me something interesting in reddit',
        expected: createToolCallMessage(redditToolDefinition.name)
    }],
    scorers: [ToolCallMatch]
})