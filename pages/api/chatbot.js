import { Configuration, OpenAIApi } from 'openai';
import fs from 'fs';
import path from 'path';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const knowledgeBasePath = path.resolve(process.cwd(), 'data/knowledgeBase.json');
const knowledgeBase = JSON.parse(fs.readFileSync(knowledgeBasePath, 'utf-8'));

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;

    const relevantChunks = knowledgeBase.filter(chunk =>
      chunk.toLowerCase().includes(message.toLowerCase())
    );

    const prompt = `Here is the relevant information based on your question: ${relevantChunks.join(' ')}`;

    const response = await openai.createChatCompletion({
      model: "gpt-4-turbo",
      messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: prompt }],
      max_tokens: 100,
    });

    res.status(200).json({ response: response.data.choices[0].message.content });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}