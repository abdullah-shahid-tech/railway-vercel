import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'
import { login } from '@/app/actions'
import { getSession } from '@/lib/session'

export default async function LoginPage({ searchParams }) {
  if (await getSession()) redirect('/dashboard') // already logged in
  const { registered } = await searchParams

  return (
    <AuthForm
      mode="login"
      action={login}
      notice={registered && 'Account created. Please login.'}
    />
  )
}
