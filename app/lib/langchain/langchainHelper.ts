import { systemTrainingData } from './systemTrainingData';
import { ChatOpenAI } from "@langchain/openai";
import { z } from 'zod';
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";

// Define environment variables and check for API key
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not defined in the environment variables');
}

// Initialize the LangChain ChatOpenAI model
const model = new ChatOpenAI({
  model: "gpt-4",
  apiKey: OPENAI_API_KEY,
  temperature: 1, // Adjust the temperature based on your needs
});

// Define the SwimWorkout schema using Zod for validation and type inference
const SwimWorkoutSchema = z.object({
  focus: z.string(),
  warmup: z.array(z.string()),
  preset: z.array(z.string()),
  main_set: z.array(z.string()),
  cooldown: z.array(z.string()),
  distance: z.string().optional(),
  duration: z.string().optional(),
  intensity: z.string().optional(),
  description: z.string().optional(),
});

type SwimWorkout = z.infer<typeof SwimWorkoutSchema>;

// Prepare the structured model
const structuredLlm = model.withStructuredOutput(SwimWorkoutSchema);

const prompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(systemTrainingData),
  HumanMessagePromptTemplate.fromTemplate('{input}'),
]);

// Function to generate a structured swim workout
export async function generateSwimWorkout(inputText: string): Promise<SwimWorkout | { error: string, response?: string }> {
  try {
    // Format the input text into the prompt
    const formattedPrompt = await prompt.format({ input: inputText });

    // Invoke the structured LLM with the formatted prompt
    const response = await structuredLlm.invoke(formattedPrompt);

    // Validate and parse the response JSON
    const parsedResponse = SwimWorkoutSchema.safeParse(response);

    if (!parsedResponse.success) {
      console.error('Validation error:', parsedResponse.error);

      // Return the response as a fallback message
      return { error: 'Invalid response format', response: response as unknown as string };
    }

    return parsedResponse.data;
  } catch (error) {
    console.error('Error generating swim workout:', error);

    // Fallback to the AI response as a plain message
    return { error: 'Failed to generate workout.'};
  }
}
