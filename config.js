// config.js
import { createClient } from "@supabase/supabase-js";

// القيم دي بتتسحب من الـ Environment Variables على Vercel
const SUPABASE_URL = process.env.SUPABASE_URL; 
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// لو محتاج تضيف اسم قاعدة البيانات أو الباسورد كقيم إضافية
const DB_NAME = "desinahub org"; // اسم قاعدة البيانات
const DB_PASSWORD = process.env.DB_PASSWORD; // الباسورد لو حطيته في Vercel

// إنشاء الاتصال بـ Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// تصدير الاتصال علشان تستخدمه في باقي الملفات
export { supabase, DB_NAME, DB_PASSWORD };
