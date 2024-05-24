import express from 'express';
import bodyParser from 'body-parser';
import chatbotHandler from './api/chatbot.js';

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/api/chatbot', chatbotHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
