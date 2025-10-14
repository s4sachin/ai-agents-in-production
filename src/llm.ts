import type { AIMessage } from "../types";
import { openai } from "./ai";
import { zodFunction, zodResponseFormat } from "openai/helpers/zod";
import { systemPrompt as defaultSystemPrompt } from "./systemPrompt";
import { z } from "zod";
import { getSummary } from "./memory";

export const runLLM = async ({
  messages,
  tools = [],
  temperature = 0.1,
  systemPrompt,
}: {
  messages: AIMessage[];
  tools?: any[];
  temperature?: number;
  systemPrompt?: string;
}) => {
  const formattedTools = tools.map(zodFunction);
  const summary = await getSummary();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature,
    messages: [
      {
        role: "system",
        content: `${
          systemPrompt || defaultSystemPrompt
        }. Conversation so far: ${summary}`,
      },
      ...messages,
    ],
    ...(formattedTools.length > 0 && {
      tools: formattedTools,
      tool_choice: "auto",
      parallel_tool_calls: false,
    }),
  });

  return response.choices[0].message;
};

export const runApprovalCheck = async (userMessage: string) => {
  const result = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    temperature: 0.1,
    response_format: zodResponseFormat(
      z.object({
        approved: z
          .boolean()
          .describe("Weather the user approved the action or not"),
      }),
      "approval"
    ),
    messages: [
      {
        role: "system",
        content:
          "Your job is to determine if the user approved the image generation. If you are not sure, then it is not approved.",
      },
      { role: "user", content: userMessage },
    ],
  });

  return result.choices[0].message.parsed?.approved;
};

export const summarizeMessages = async (messages: AIMessage[]) => {
  const response = await runLLM({
    messages,
    systemPrompt:
      "You are a helpful assistant that summarizes conversations play by play between a human and an AI. Summarize the conversation in a concise manner, focusing on the main points and topics discussed. The summary should be brief and to the point, capturing the essence of the interaction without going into excessive detail. Use clear and simple language. This summary will be used in another LLM prompt, so make sure it is relevant and useful for that context.",
    temperature: 0.3,
  });

  return response.content || "";
};
