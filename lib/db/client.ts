import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/lib/generated/prisma/client'

function makePrisma() {
  const connectionString = process.env.DIRECT_URL!
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

const g = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = g.prisma ?? makePrisma()

if (process.env.NODE_ENV !== 'production') g.prisma = prisma
