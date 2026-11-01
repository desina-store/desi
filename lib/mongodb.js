import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://Vercel-Admin-desinahub_data:<db_password>@desinahub-data.g7in3ky.mongodb.net/?appName=desinahub-data";

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  // للتأكد من وجود الـ URI في بيئة العمل
}

if (process.env.NODE_ENV === 'development') {
  // في وضع التطوير، استخدام global variable لمنع تكرار الاتصالات مع الـ HMR
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // في وضع الـ Production، إنشاء اتصال مباشر ومستقر
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// دالة الـ getDatabase الأساسية اللي الويب هوك بيستدعيها
export async function getDatabase(dbName) {
  const connectedClient = await clientPromise;
  const databaseName = dbName || process.env.MONGODB_DATABASE || 'DeSinaHubDB';
  return connectedClient.db(databaseName);
}

export default clientPromise;
