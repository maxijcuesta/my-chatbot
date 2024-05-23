import React, { useState } from 'react';
function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const sendMessage = async () => {
    setError('');
    setResponse('');
    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResponse(data.response);
      }
    } catch (err) {
      setError('Failed to fetch response from server');
      console.error('Error fetching response:', err);
    }
  };

  return (
    <div>
      <h1>Maxibot</h1>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Pregunta..."
      />
      <button onClick={sendMessage}>Send</button>
      <div>
        <h2>Response:</h2>
        <p>{response}</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}

export default App;