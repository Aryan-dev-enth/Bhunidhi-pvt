import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCKxVyE93D_Rji6mrg00pis7EjgPeWu7SE");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const geminiPropertyResult = async (input1, input2) => {
  console.log("here");
  try {
    const prompt1 = `Generate AI properties for the following details: compile the properties ${JSON.stringify(input1)} and ${JSON.stringify(input2)} such that all of the common fields are mapped with the one in the input 2. Return a JSON data result.`;

    // Assuming model.generateContent is the correct method
    const result1 = await model.generateContent(prompt1);

    console.log(result1);
    return result1;
  } catch (error) {
    console.error("Error generating properties:", error);
    throw error;
  }
};
