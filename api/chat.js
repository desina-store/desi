// api/chat.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GEMINI_API_KEY; 
  const { message } = req.body;

  try {
    // اتصال مباشر بالرابط الأحدث دون الحاجة لأي مكتبات أو ملفات json
    const response = await fetch('https://googleapis.com', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey 
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      })
    });

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "لم أتمكن من جلب رد، يرجى المحاولة مجدداً.";
    
    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: "حدث خطأ في الاتصال بالذكاء الاصطناعي" });
  }
}
