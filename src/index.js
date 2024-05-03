import env from 'dotenv';
import mongoose from 'mongoose';
import { DB_NAME } from './constant.js';
env.config()

import { connectDB } from './db/index.js';



connectDB();