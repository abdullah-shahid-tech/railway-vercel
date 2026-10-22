'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { api } from '@/lib/api'
import { requireSession } from '@/lib/session'

const pick = (form, keys) => Object.fromEntries(keys.map((k) => [k, form.get(k)]))

const cookieOptions = (maxAge) => ({
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
  maxAge,
  secure: process.env.NODE_ENV === 'production',
})

export async function login(_prev, form) {
  const { ok, data } = await api('/auth/login', { method: 'POST', body: pick(form, ['email', 'password']) })
  if (!ok) return { error: data.error || 'Login failed' }

  const jar = await cookies()
  jar.set('token', data.token, cookieOptions(60 * 60 * 24))
  redirect('/dashboard')
}

export async function register(_prev, form) {
  const fields = ['name', 'email', 'password', 'role', 'adminCode']
  const { ok, data } = await api('/auth/register', { method: 'POST', body: pick(form, fields) })
  if (!ok) return { error: data.error || 'Registration failed' }

  redirect('/login?registered=1')
}

export async function logout() {
  const jar = await cookies()
  jar.delete('token')
  redirect('/login')
}

export async function addCourse(form) {
  const { token } = await requireSession(['teacher', 'admin']) // server actions need their own check
  await api('/api/courses', { method: 'POST', token, body: { title: form.get('title') } })
  revalidatePath('/dashboard')
}
