import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AuthNav } from '@/components/layout/AuthNav'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header authSlot={<AuthNav />} />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
