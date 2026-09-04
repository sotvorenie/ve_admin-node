import {PrismaClient} from "./generated/prisma/client.js";
import {PrismaPg} from "@prisma/adapter-pg";
import pkg from 'pg';

const dbUrl = process.env.DATABASE_URL

const { Pool } = pkg;
const pool = new Pool({connectionString: dbUrl});
const adapter = new PrismaPg(pool);

export const db = new PrismaClient({adapter})