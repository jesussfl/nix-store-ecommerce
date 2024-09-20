import React from 'react'
import { Card, CardHeader, CardTitle } from '@/components/shared/card/card'

interface StatisticCardProps {
  number: number
  title: string
  Icon: React.ReactNode
  className?: string
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  number,
  title,
  Icon,
  className,
}) => {
  return (
    <Card className={className}>
      <CardHeader className="flex h-full flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="text-2xl font-bold">{number}</div>
        </div>
        <div className="ml-8 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
          {Icon}
        </div>
      </CardHeader>
    </Card>
  )
}

export default StatisticCard
