// prisma/seed.ts — seeds the DB from mock arrays (idempotent via upsert)
// Uses relative imports to avoid @/ alias resolution issues under tsx.

import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../lib/generated/prisma/client'
import {
  categories,
  brands,
  products,
  customers,
  orders,
  leads,
  enquiries,
  faqs,
} from '../lib/mock/data'

const connectionString = process.env.DIRECT_URL!
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱  Seeding database…')

  // ── 1. Categories ────────────────────────────────────────────────────────
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {
        name: cat.name,
        slug: cat.slug,
        image: cat.image ?? null,
        sortOrder: cat.sortOrder,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image: cat.image ?? null,
        sortOrder: cat.sortOrder,
      },
    })
  }

  // ── 2. Brands ─────────────────────────────────────────────────────────────
  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { id: brand.id },
      update: {
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo ?? null,
        description: brand.description ?? null,
      },
      create: {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo ?? null,
        description: brand.description ?? null,
      },
    })
  }

  // ── 3. Products + Variants ───────────────────────────────────────────────
  for (const prod of products) {
    await prisma.product.upsert({
      where: { id: prod.id },
      update: {
        name: prod.name,
        slug: prod.slug,
        brandId: prod.brandId,
        categoryId: prod.categoryId,
        description: prod.description,
        images: prod.images,
        modelGlb: prod.modelGlb ?? null,
        stockStatus: prod.stockStatus,
        isFeatured: prod.isFeatured,
        variants: {
          deleteMany: {},
          create: prod.variants.map((v) => ({
            size: v.size,
            price: v.price ?? null,
            image: v.image ?? null,
          })),
        },
      },
      create: {
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        brandId: prod.brandId,
        categoryId: prod.categoryId,
        description: prod.description,
        images: prod.images,
        modelGlb: prod.modelGlb ?? null,
        stockStatus: prod.stockStatus,
        isFeatured: prod.isFeatured,
        variants: {
          create: prod.variants.map((v) => ({
            size: v.size,
            price: v.price ?? null,
            image: v.image ?? null,
          })),
        },
      },
    })
  }

  // ── 4. Customers (CustomerProfile) ───────────────────────────────────────
  for (const cust of customers) {
    await prisma.customerProfile.upsert({
      where: { id: cust.id },
      update: {
        businessName: cust.businessName,
        contactName: cust.contactName,
        phone: cust.phone,
        email: cust.email,
        tier: cust.tier,
        pointsBalance: cust.pointsBalance,
        referralCode: cust.referralCode,
        registeredAt: new Date(cust.registeredAt),
      },
      create: {
        id: cust.id,
        userId: null,
        businessName: cust.businessName,
        contactName: cust.contactName,
        phone: cust.phone,
        email: cust.email,
        tier: cust.tier,
        pointsBalance: cust.pointsBalance,
        referralCode: cust.referralCode,
        registeredAt: new Date(cust.registeredAt),
      },
    })
  }

  // ── 5. Orders + OrderItems ───────────────────────────────────────────────
  for (const ord of orders) {
    await prisma.order.upsert({
      where: { id: ord.id },
      update: {
        customerId: ord.customerId,
        totalValue: ord.totalValue,
        status: ord.status,
        createdAt: new Date(ord.createdAt),
        items: {
          deleteMany: {},
          create: ord.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            size: item.size,
            qty: item.qty,
            unitValue: item.unitValue,
          })),
        },
      },
      create: {
        id: ord.id,
        customerId: ord.customerId,
        totalValue: ord.totalValue,
        status: ord.status,
        createdAt: new Date(ord.createdAt),
        items: {
          create: ord.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            size: item.size,
            qty: item.qty,
            unitValue: item.unitValue,
          })),
        },
      },
    })
  }

  // ── 6. Leads ─────────────────────────────────────────────────────────────
  for (const lead of leads) {
    await prisma.lead.upsert({
      where: { id: lead.id },
      update: {
        source: lead.source,
        status: lead.status,
        name: lead.name,
        phone: lead.phone,
        businessName: lead.businessName ?? null,
        notes: lead.notes ?? null,
        createdAt: new Date(lead.createdAt),
      },
      create: {
        id: lead.id,
        source: lead.source,
        status: lead.status,
        name: lead.name,
        phone: lead.phone,
        businessName: lead.businessName ?? null,
        notes: lead.notes ?? null,
        createdAt: new Date(lead.createdAt),
      },
    })
  }

  // ── 7. Enquiries ──────────────────────────────────────────────────────────
  for (const enq of enquiries) {
    await prisma.enquiry.upsert({
      where: { id: enq.id },
      update: {
        name: enq.name,
        phone: enq.phone,
        business: enq.business ?? null,
        products: enq.products,
        quantity: enq.quantity ?? null,
        location: enq.location ?? null,
        message: enq.message ?? null,
        handled: enq.handled,
        createdAt: new Date(enq.createdAt),
      },
      create: {
        id: enq.id,
        name: enq.name,
        phone: enq.phone,
        business: enq.business ?? null,
        products: enq.products,
        quantity: enq.quantity ?? null,
        location: enq.location ?? null,
        message: enq.message ?? null,
        handled: enq.handled,
        createdAt: new Date(enq.createdAt),
      },
    })
  }

  // ── 8. FAQs ───────────────────────────────────────────────────────────────
  for (let i = 0; i < faqs.length; i++) {
    const faq = faqs[i]
    await prisma.faq.upsert({
      where: { id: faq.id },
      update: {
        question: faq.question,
        answer: faq.answer,
        sortOrder: i,
      },
      create: {
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        sortOrder: i,
      },
    })
  }

  // ── 9. SiteContent singleton ─────────────────────────────────────────────
  await prisma.siteContent.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      heroHeadline: 'Your Complete Bakery & Food Ingredients Wholesale Partner',
      heroSubtext:
        'Trusted supplier of premium bakery ingredients, syrups, dairy and frozen products to businesses across Karnataka.',
      ctaLabel: 'Order via WhatsApp',
      aboutCopy:
        "Shreepathy & Co is a Bangalore-based wholesale distributor of bakery raw materials, fast-food ingredients, hotel supplies and more. We partner with leading brands like Pillsbury, Rich's, Monin, Amul and Morde to deliver consistent quality to bakeries, restaurants and caterers.",
      contactPhone: '+91 99999 99999',
      contactEmail: 'info@shreepathyandco.com',
      contactAddress: 'Bangalore, Karnataka, India',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=placeholder',
    },
  })

  // ── 10. Settings singleton ────────────────────────────────────────────────
  await prisma.settings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      whatsappNumber: '919999999999',
      businessName: 'Shreepathy & Co',
      businessHours: 'Mon–Sat 9 AM – 6 PM',
      seoTitle: 'Shreepathy & Co — Wholesale Bakery & Food Ingredients',
      seoDescription:
        'Buy bakery ingredients, syrups, dairy and frozen food products wholesale from Shreepathy & Co, Bangalore.',
    },
  })

  // ── Summary ───────────────────────────────────────────────────────────────
  const counts = await Promise.all([
    prisma.category.count(),
    prisma.brand.count(),
    prisma.product.count(),
    prisma.productVariant.count(),
    prisma.customerProfile.count(),
    prisma.order.count(),
    prisma.orderItem.count(),
    prisma.lead.count(),
    prisma.enquiry.count(),
    prisma.faq.count(),
    prisma.siteContent.count(),
    prisma.settings.count(),
  ])

  console.log('\n✅  Seed complete. Row counts:')
  console.log(`   categories    : ${counts[0]}`)
  console.log(`   brands        : ${counts[1]}`)
  console.log(`   products      : ${counts[2]}`)
  console.log(`   variants      : ${counts[3]}`)
  console.log(`   customers     : ${counts[4]}`)
  console.log(`   orders        : ${counts[5]}`)
  console.log(`   orderItems    : ${counts[6]}`)
  console.log(`   leads         : ${counts[7]}`)
  console.log(`   enquiries     : ${counts[8]}`)
  console.log(`   faqs          : ${counts[9]}`)
  console.log(`   siteContent   : ${counts[10]}`)
  console.log(`   settings      : ${counts[11]}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
