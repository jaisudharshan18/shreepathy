import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/lib/generated/prisma/client'

function makePrisma() {
  const connectionString = process.env.DIRECT_URL!
  // Limit max pool size to 1 per worker so that next build's 11 parallel workers
  // stay well under Supabase session-mode's connection limit of 15.
  const pool = new Pool({ connectionString, max: 1 })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

const g = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = g.prisma ?? makePrisma()

if (process.env.NODE_ENV !== 'production') g.prisma = prisma
