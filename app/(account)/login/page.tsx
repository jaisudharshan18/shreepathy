import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '@/components/forms/LoginForm'

export const metadata = { title: 'Customer Login — Shreepathy & Co' }

export default function LoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl text-brand-navy">Customer Login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
