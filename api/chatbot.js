const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
const path = require('path');

console.log('Starting chatbot handler...');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log('OpenAI API Key:', process.env.OPENAI_API_KEY);

const openai = new OpenAIApi(configuration);

const knowledgeBasePath = path.resolve(process.cwd(), 'data/knowledgeBase.json');
const knowledgeBase = JSON.parse(fs.readFileSync(knowledgeBasePath, 'utf-8'));

console.log('Knowledge base loaded');

module.exports = async function handler(req, res) {
  console.log('Handler called');
  if (req.method !== 'POST') {
    console.log('Invalid method');
    return res.status(405).end(); // Method Not Allowed
  }

  const { message } = req.body;
  console.log('Received message:', message);

  const relevantChunks = knowledgeBase.filter(chunk =>
    chunk.toLowerCase().includes(message.toLowerCase())
  );

  const prompt = `Here is the relevant information based on your question: ${relevantChunks.join(' ')}`;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 100,
    });

    console.log('OpenAI response:', response.data.choices[0].message.content);
    res.status(200).json({ response: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ error: 'Failed to call OpenAI API' });
  }
}