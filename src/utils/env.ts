import dotenv from 'dotenv';

dotenv.config();

export const DATABASE_URL: string = process.env.DATABASE_URL || "";
export const DB_NAME: string = process.env.DB_NAME || "";

export const SECRET: string = process.env.SECRET || "";