import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'
import { register } from '@/app/actions'
import { getSession } from '@/lib/session'

export default async function RegisterPage() {
  if (await getSession()) redirect('/dashboard')

  return <AuthForm mode="register" action={register} />
}
