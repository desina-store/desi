export default async function handler(req, res) {
  // السماح بطلبات GET للاختبار المباشر من المتصفح، و POST لاستعلامات الوكلاء
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const query = req.method === 'POST' ? (req.body?.query || 'all') : 'direct_browser_test';

    return res.status(200).json({
      status: "success",
      score: 1.0,
      message: "تم الاتصال بنجاح بـ A2A Endpoint الخاصة بمتجر DeSinaHub",
      platform: "DeSinaHub Egypt",
      queryReceived: query,
      categories: [
        "الموبايلات",
        "الأجهزة الكهربائية",
        "الكمبيوتر وملحقاته",
        "الملابس الرياضية",
        "الملابس والأوتلت"
      ]
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
}
