// scripts/setup-buckets.ts — idempotent Supabase storage bucket setup
// Uses relative imports (no @/ alias under tsx)

import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const admin = createClient(url, serviceKey)

const BUCKETS = [
  { name: 'product-images', public: true },
  { name: 'product-models', public: true },
]

async function main() {
  console.log('Setting up Supabase storage buckets…')

  for (const bucket of BUCKETS) {
    const { data, error } = await admin.storage.createBucket(bucket.name, {
      public: bucket.public,
    })

    if (error) {
      // Supabase returns "The resource already exists" when bucket already created
      if (
        error.message.includes('already exists') ||
        error.message.includes('already been created') ||
        (error as { status?: number }).status === 409
      ) {
        console.log(`  bucket "${bucket.name}": already existed (ok)`)
      } else {
        console.error(`  bucket "${bucket.name}": ERROR —`, error.message)
      }
    } else {
      console.log(`  bucket "${bucket.name}": created`, data)
    }
  }

  console.log('Done.')
}

main().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
