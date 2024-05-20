const fs = require('fs');
const pdf = require('pdf-parse');

const pdfToText = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
};

const processText = async (filePath) => {
  const text = await pdfToText(filePath);
  const chunks = text.match(/(.|[\r\n]){1,2000}/g); // Divide el texto en fragmentos de 2000 caracteres
  return chunks;
};

// Ruta correcta al archivo PDF
processText('pdf/Chatbot personalizado.pdf').then(chunks => {
  fs.writeFileSync('data/knowledgeBase.json', JSON.stringify(chunks, null, 2));
  console.log('Knowledge base has been created.');
});