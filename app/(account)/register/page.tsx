import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RegisterForm } from '@/components/forms/RegisterForm'

export const metadata = { title: 'Create Account — Shreepathy & Co' }

export default function RegisterPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl text-brand-navy">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  )
}
