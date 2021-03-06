import dotenv from 'dotenv';

dotenv.config();

// Database configuration
const config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAINM,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID
};


export default config;
