import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AccountNav } from '@/components/layout/AccountNav'
import { AuthNav } from '@/components/layout/AuthNav'

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header authSlot={<AuthNav />} />
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
          <AccountNav />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
      <Footer />
    </>
  )
}
