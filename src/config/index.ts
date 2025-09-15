// This file contains all the basic configuration logic for the app server to work
import dotenv from 'dotenv';

type ServerConfig = {
    PORT: number,
    MONGO_URI: string,
    REDIS_URL: string,
    REDIS_COUNTER_KEY: string,
    BASE_URL: string,
    REDIS_URL_TTL_SECONDS: number
}

function loadEnv() {
    dotenv.config();
    console.log(`Environment variables loaded`);
}

loadEnv();

export const serverConfig: ServerConfig = {
    PORT: Number(process.env.PORT) || 3001,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/urlShortener',
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
    REDIS_COUNTER_KEY: process.env.REDIS_COUNTER_KEY || 'url_shortener_counter',
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
    REDIS_URL_TTL_SECONDS: Number(process.env.REDIS_URL_TTL_SECONDS) || 86400, // Default to 1 day
};