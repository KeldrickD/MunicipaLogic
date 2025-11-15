import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  console.warn(
    "OPENAI_API_KEY not set. GPT-5.1 budget scoring will not work."
  );
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "placeholder",
});

