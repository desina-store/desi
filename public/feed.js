// مصفوفة المنتجات بتاعتك
const products = [
    { code: 1, name: {en: "DeSina Urban Jacket [Outlet]", ar: "جاكيت ديسينا الكاجوال [تصفيات]"}, category: "Outlet", img: "assets/p4.webp", type: "outlet", price: 800, oldPrice: 1500, info: { brand: {en: "DeSina", ar: "دسينا"}, spec: {en: "Premium Cotton Blend", ar: "مزيج قطن فاخر ممتازة"}, warranty: {en: "Save 500 EGP", ar: "وفرت 500 ج.م بالمللي"} } },
    { code: 2, name: {en: "iPhone 16 Pro Max 256GB", ar: "آيفون 16 برو ماكس 256 جيجا"}, category: "Mobiles", img: "assets/iphone.webp", type: "hardware", price: 63000, info: { brand: {en: "Apple", ar: "أبل"}, spec: {en: "256GB / Titanium Gray", ar: "مساحة 256 جيجا / تيتانيوم"}, warranty: {en: "1 Year Local & Int.", ar: "ضمان سنة دولي ومحلي"} } },
    { code: 3, name: {en: "Pro Compression Gym T-Shirt", ar: "تيشيرت ضغط رياضي للچيم"}, category: "Sports", img: "assets/gym.t-shirt.webp", type: "sports", price: 600, info: { fabric: {en: "Dry-Fit Spandex / Polyester", ar: "دراي فيت مطاط / بوليستر"}, sizes: {en: "M, L, XL, XXL", ar: "M, L, XL, XXL"}, itemType: {en: "Athletic Compression", ar: "ملابس ضغط رياضية"} } },
    { code: 4, name: {en: "Performance Athletic Shorts", ar: "شورت رياضي عالي الأداء"}, category: "Sports", img: "assets/sports_shorts.webp", type: "sports", price: 400, info: { fabric: {en: "Ultra-Lightweight Breathable Mesh", ar: "نسيج شبكي خفيف مسامي"}, sizes: {en: "S, M, L, XL", ar: "S, M, L, XL"}, itemType: {en: "Training / Running", ar: "تدريب / جري"} } },
    { code: 5, name: {en: "Samsung Crystal UHD 55 Inch", ar: "شاشة سامسونج كريستال 55 بوصة"}, category: "Mobiles", img: "assets/samsung_tv.webp", type: "hardware", price: 1000, info: { brand: {en: "Samsung", ar: "سامسونج"}, spec: {en: "55\" 4K Smart Tizen OS", ar: "55 بوصة 4K سمارت"}, warranty: {en: "2 Years Extra", ar: "ضمان سنتين ضد عيوب الصناعة"} } },
    { code: 6, name: {en: "LG Smart TV 50 Inch [Outlet]", ar: "شاشة إل جي 50 بوصة [أوت ليت]"}, category: "Outlet", img: "assets/lg_outlet.webp", type: "outlet", price: 15000, oldPrice: 1400, info: { brand: {en: "LG", ar: "إل جي"}, spec: {en: "50\" 4K Smart ThinQ", ar: "50 بوصة 4K سمارت"}, warranty: {en: "Save 400 EGP", ar: "وفرت 400 ج.م بالمللي"} } },
    { code: 7, name: {en: "iPhone 16 Pro Max 256GB", ar: "آيفون 16 برو ماكس 256 جيجا"}, category: "Mobiles", img: "assets/iphone.webp", type: "hardware", price: 63000, info: { brand: {en: "Apple", ar: "أبل"}, spec: {en: "256GB / Titanium Gray", ar: "مساحة 256 جيجا / تيتانيوم"}, warranty: {en: "1 Year Local & Int.", ar: "ضمان سنة دولي ومحلي"} } },
    { code: 8, name: {en: "Apple AirPods Pro Gen 2", ar: "سماعة أبل أيربودز برو الجيل الثاني"}, category: "Mobiles", img: "assets/airpods.webp", type: "hardware", price: 1000, info: { brand: {en: "Apple", ar: "أبل"}, spec: {en: "MagSafe Case (USB-C)", ar: "علبة ماج سيف بمنفذ تايب سي"}, warranty: {en: "1 Year Active Warranty", ar: "ضمان سنة مفعل"} } },
    { code: 9, name: {en: "Anker Soundcore Liberty 4", ar: "سماعة أنكر ساوندكور ليبرتي 4"}, category: "Mobiles", img: "assets/anker.webp", type: "hardware", price: 4000, info: { brand: {en: "Anker", ar: "أنكر"}, spec: {en: "Hi-Res Audio / Spatial Sound", ar: "صوت نقي عالي الدقة / صوت محيطي"}, warranty: {en: "18 Months Local Agent", ar: "ضمان 18 شهر من الوكيل المحلي"} } },
    { code: 10, name: {en: "DeSina Urban Jacket [Outlet]", ar: "جاكيت ديسينا الكاجوال [تصفيات]"}, category: "Outlet", img: "assets/p4.webp", type: "outlet", price: 1000, oldPrice: 1500, info: { brand: {en: "DeSina", ar: "ديسينا"}, spec: {en: "Premium Cotton Blend", ar: "مزيج قطن فاخر ممتازة"}, warranty: {en: "Save 500 EGP", ar: "وفرت 500 ج.م بالمللي"} } },
    { code: 11, name: {en: "LG Smart TV 50 Inch [Outlet]", ar: "شاشة إل جي 50 بوصة [أوت ليت]"}, category: "Outlet", img: "assets/lg_outlet.webp", type: "outlet", price: 1000, oldPrice: 1400, info: { brand: {en: "LG", ar: "إل جي"}, spec: {en: "50\" 4K Smart ThinQ", ar: "50 بوصة 4K سمارت"}, warranty: {en: "Save 400 EGP", ar: "وفرت 400 ج.م بالمللي"} } }
];

// دالة لتوليد ملف الـ XML
function generateProductFeed() {
    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xmlContent += `<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">\n`;
    xmlContent += `<channel>\n`;
    xmlContent += `<title>DeSina Store Catalog</title>\n`;
    xmlContent += `<link>https://www.desinahub.com</link>\n`;
    xmlContent += `<description>Product catalog for DeSina store</description>\n`;

    products.forEach(product => {
        let brandName = product.info && product.info.brand ? product.info.brand.en : "DeSina";
        let specDesc = product.info && product.info.spec ? product.info.spec.en : (product.info && product.info.fabric ? product.info.fabric.en : "");
        
        xmlContent += `  <item>\n`;
        xmlContent += `    <g:id>${product.code}</g:id>\n`
        xmlContent += `    <title><![CDATA[${product.name.ar} - ${product.name.en}]]></title>\n`;
        xmlContent += `    <description><![CDATA[${specDesc}]]></description>\n`;
        xmlContent += `    <g:link>https://www.desinahub.com/product.html?id=${product.code}</g:link>\n`;
        xmlContent += `    <image_link>https://www.desinahub.com/${product.img}</image_link>\n`;
        xmlContent += `    <g:condition>new</g:condition>\n`;
        xmlContent += `    <g:availability>in stock</g:availability>\n`;
        xmlContent += `    <g:price>${product.price} EGP</g:price>\n`;
        if (product.oldPrice) {
            xmlContent += `    <g:sale_price>${product.price} EGP</g:sale_price>\n`;
        }
        xmlContent += `    <g:brand>${brandName}</g:brand>\n`;
        xmlContent += `    <g:product_type>${product.category}</g:product_type>\n`;
        xmlContent += `  </item>\n`;
    });

    xmlContent += `</channel>\n`;
    xmlContent += `</rss>`;

    return xmlContent;
}

// تشغيل الدالة وحفظ الملف أو عرضه
const xmlOutput = generateProductFeed();
console.log(xmlOutput);
