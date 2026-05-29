async function testDeepSeek() {
  const apiKey = 'sk-fd5741afcaa6489babb509913b0c827d';
  console.log('Testing DeepSeek API directly with fetch...');
  try {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10
      })
    });
    
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err: any) {
    console.error('Error:', err);
  }
}

testDeepSeek();
