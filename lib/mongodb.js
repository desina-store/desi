import { MongoClient, ServerApiVersion } from 'mongodb';

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // Serverless instances are short lived: fail fast instead of hanging on DNS retries.
  serverSelectionTimeoutMS: 8000,
  connectTimeoutMS: 8000,
  appName: 'desinahub',
};

// One client per warm instance, reused across invocations and HMR reloads.
const shared = globalThis.__desinaMongo ?? {};
globalThis.__desinaMongo = shared;

function requireUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not configured');
  }
  return uri;
}

export function getClientPromise() {
  const uri = requireUri();
  if (shared.uri !== uri) {
    shared.uri = uri;
    shared.client = new MongoClient(uri, options);
    shared.clientPromise = null;
  }
  if (!shared.clientPromise) {
    shared.clientPromise = shared.client.connect();
  }
  return shared.clientPromise;
}

export async function getDatabase(dbName) {
  const client = await getClientPromise();
  const databaseName = dbName || process.env.MONGODB_DATABASE || 'DeSinaHubDB';
  return client.db(databaseName);
}
