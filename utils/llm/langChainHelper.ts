// "use server";
// // lib/langchainHelper.ts

// import { SwimWorkout } from '@app/lib/types';
// import { ChatOpenAI } from "@langchain/openai";
// import { PromptTemplate } from "@langchain/core/prompts";
// // import { BaseModel, Field } from 'langchain_core/pydantic_v1';

// import { loadEnvConfig } from '@next/env';


// // Load environment variables from .env file
// loadEnvConfig(process.cwd());

// const api_key = process.env.OPENAI_API_KEY;

// const llm = new ChatOpenAI({ model: 'gpt-4', api_key });

// export const generateSwimWorkout = async (inputText: string): Promise<SwimWorkout> => {
//   const structured_llm = llm.withStructuredOutput(SwimWorkout);

//   const prompt = PromptTemplate.from_messages([
//     ['system', system_training_data],
//     ['human', '{input}']
//   ]);

//   const few_shot_structured_llm = prompt.pipe(structured_llm);

//   const response = await few_shot_structured_llm.invoke({ input: inputText });

//   return response;
// };

// // This would be your existing structured training data string
// const system_training_data = `...`; // Place your training data string here
