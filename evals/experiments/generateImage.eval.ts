import { runLLM } from "../../src/llm";
import { generateImageToolDefinition } from "../../src/tools/generateImage";
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

runEval('generateImage', {
    task: (input) => runLLM({
        messages: [{role: 'user', content: input}],
        tools: [generateImageToolDefinition]
    }),
    data: [{
        input: 'generate an image of a sunset over a mountain range',
        expected: createToolCallMessage(generateImageToolDefinition.name)
    }],
    scorers: [ToolCallMatch]
})