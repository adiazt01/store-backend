import dotenv from 'dotenv';
dotenv.config({path: `.env.${process.env.NODE_ENV}`});

import express from 'express';
import {PrismaClient} from '@prisma/client';

export const prisma = new PrismaClient();

export const app = express();
