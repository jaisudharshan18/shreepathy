import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'

export interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 py-5">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {label}
          </span>
          <span className="text-2xl font-bold text-foreground leading-none">
            {value}
          </span>
        </div>
        {icon && (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-navy/10 text-brand-navy">
            {icon}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
