import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)

export async function generateProperties(aiResponse: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

  const prompt = `Based on the following AI analysis of a building, extract the height, width, total area, and provide a brief description of the building. If any information is missing, make a reasonable estimate:

  ${aiResponse}

  Format the response as a JSON object with the following structure:
  {
    "height": number,
    "width": number,
    "totalArea": number,
    "description": string
  }`

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()
  return JSON.parse(text)
}

export async function compareData(blockchainData: any, aiProperties: any) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

  const prompt = `Compare the following blockchain data with AI-generated properties for a building. Identify any major discrepancies, ignoring minor differences. Prepare a report highlighting significant variations in height, width, area, and description. If there are no major discrepancies, state that the data is consistent.

  Blockchain data:
  ${JSON.stringify(blockchainData)}

  AI-generated properties:
  ${JSON.stringify(aiProperties)}

  Format the response as a JSON object with the following structure:
  {
    "height": string,
    "width": string,
    "area": string,
    "description": string,
    "discrepancies": string[]
  }`

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()
  return JSON.parse(text)
}

