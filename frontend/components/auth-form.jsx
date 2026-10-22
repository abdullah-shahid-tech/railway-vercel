'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// One form for both pages: mode = "login" | "register"
export function AuthForm({ mode, action, notice }) {
  const [state, formAction, pending] = useActionState(action, null)
  const [role, setRole] = useState('student')
  const isRegister = mode === 'register'

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-indigo-50 via-background to-sky-50 px-4 py-8">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-11 items-center justify-center rounded-full bg-primary/10">
            <GraduationCap className="size-6 text-primary" />
          </div>
          <CardTitle className="text-xl">{isRegister ? 'Create account' : 'Welcome back'}</CardTitle>
          <CardDescription>
            {isRegister ? 'Fill in your details to get started' : 'Login to your School Portal'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-3">
            {isRegister && <Input name="name" placeholder="Full name" required />}
            <Input name="email" type="email" placeholder="Email" required />
            <Input name="password" type="password" placeholder="Password" required />

            {isRegister && (
              <>
                <select
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
                {role === 'admin' && <Input name="adminCode" placeholder="Admin code" required />}
              </>
            )}

            {notice && (
              <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</p>
            )}
            {state?.error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.error}</p>
            )}

            <Button className="w-full" disabled={pending}>
              {pending ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {isRegister ? 'Already have an account? ' : 'No account? '}
            <Link className="font-medium text-primary hover:underline" href={isRegister ? '/login' : '/register'}>
              {isRegister ? 'Login' : 'Register'}
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
