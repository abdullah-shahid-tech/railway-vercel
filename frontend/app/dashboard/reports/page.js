import Link from 'next/link'
import { BookOpen, UserPlus } from 'lucide-react'
import { api } from '@/lib/api'
import { requireSession } from '@/lib/session'
import { cn } from '@/lib/utils'
import { RefreshButton } from '@/components/refresh-button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const TIMEZONE = 'Asia/Karachi' // change this if you want times shown in another zone

const RANGES = [
  { label: '10 minutes', minutes: 10 },
  { label: '1 hour', minutes: 60 },
  { label: '24 hours', minutes: 1440 },
  { label: '7 days', minutes: 10080 },
]
const DEFAULT_MINUTES = 60

const formatTime = (iso) =>
  new Date(iso).toLocaleString('en-GB', { timeZone: TIMEZONE, dateStyle: 'medium', timeStyle: 'short' })

function Section({ icon: Icon, title, count, empty, children }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="size-5 text-primary" />
          {title}
          <Badge variant={count ? 'success' : 'default'}>{count}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {count ? <ul className="divide-y">{children}</ul> : <p className="text-sm text-muted-foreground">{empty}</p>}
      </CardContent>
    </Card>
  )
}

export default async function ReportsPage({ searchParams }) {
  const { token } = await requireSession(['admin']) // only admins can open this page
  const { minutes: raw } = await searchParams
  const minutes = RANGES.some((r) => r.minutes === Number(raw)) ? Number(raw) : DEFAULT_MINUTES

  // The backend builds the report from the database at this moment (no cron needed)
  const { data } = await api(`/api/reports/live?minutes=${minutes}`, { token })
  const report = data.report
  const rangeLabel = RANGES.find((r) => r.minutes === minutes).label

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Activity report</h1>
          <p className="text-sm text-muted-foreground">New students and courses in the last {rangeLabel}.</p>
        </div>
        <RefreshButton />
      </div>

      <div className="flex flex-wrap gap-1">
        {RANGES.map((r) => (
          <Link
            key={r.minutes}
            href={`/dashboard/reports?minutes=${r.minutes}`}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              r.minutes === minutes
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            {r.label}
          </Link>
        ))}
      </div>

      {!report ? (
        <Card>
          <CardContent className="p-5 text-sm text-destructive">
            {data.error || 'Could not load the report. Check that the backend is running and has the latest code.'}
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">Generated {formatTime(report.generatedAt)}</p>

          <Section
            icon={UserPlus}
            title="New students"
            count={report.newStudents.length}
            empty="No students registered in this period."
          >
            {report.newStudents.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{s.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{s.email}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{formatTime(s.created_at)}</span>
              </li>
            ))}
          </Section>

          <Section
            icon={BookOpen}
            title="New courses"
            count={report.newCourses.length}
            empty="No courses added in this period."
          >
            {report.newCourses.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{c.title}</p>
                  <p className="truncate text-xs text-muted-foreground">by {c.teacher}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{formatTime(c.created_at)}</span>
              </li>
            ))}
          </Section>
        </>
      )}
    </>
  )
}
