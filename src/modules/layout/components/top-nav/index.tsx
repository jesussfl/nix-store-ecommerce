import React from 'react'

import { cn } from '@/libs/utils'
import ToogleTheme from '@/modules/common/components/toogle-theme/toogle-theme'

const TopNav = () => {
  return (
    <div
      className={cn(
        `sticky inset-x-0 top-0 z-30 w-full border-b bg-background transition-all`
      )}
    >
      <div className="flex h-[56px] items-center justify-between px-4">
        <div className="ml-auto flex items-center space-x-4">
          <ToogleTheme />
          {/* <UserNav /> */}
        </div>
      </div>
    </div>
  )
}

export default TopNav
