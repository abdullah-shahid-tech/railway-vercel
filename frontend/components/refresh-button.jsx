'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Re-runs the server page (so the report is rebuilt from the database)
export function RefreshButton() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  return (
    <Button variant="outline" size="sm" disabled={pending} onClick={() => startTransition(() => router.refresh())}>
      <RefreshCw className={`size-4 ${pending ? 'animate-spin' : ''}`} />
      {pending ? 'Refreshing...' : 'Refresh'}
    </Button>
  )
}
