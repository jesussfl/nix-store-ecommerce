import { useSidebarContext } from '@/lib/context/sidebar-context'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { Button } from '@/modules/common/components/button'
import UserNav from '@/modules/common/components/user-nav/user-nav'
import { isSmallScreen } from '@/utils/helpers/is-small-screen'
import { Navbar } from 'flowbite-react'
import { useEffect, useState, type FC } from 'react'
import { HiMenuAlt1, HiX } from 'react-icons/hi'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/modules/common/components/dropdown-menu/dropdown-menu'

export const DashboardNavbar: FC<Record<string, never>> = function () {
  const { isCollapsed: isSidebarCollapsed, setCollapsed: setSidebarCollapsed } =
    useSidebarContext()
  const user = useCurrentUser()

  return (
    <header>
      {isSmallScreen() && (
        <Navbar fluid className="fixed top-0 z-30 w-full bg-dark p-0 sm:p-0">
          <div className="w-full p-3 pr-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  aria-controls="sidebar"
                  aria-expanded
                  className="mr-2 cursor-pointer rounded p-2 text-gray-200"
                  onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                >
                  {isSidebarCollapsed || !isSmallScreen() ? (
                    <HiMenuAlt1 className="h-6 w-6" />
                  ) : (
                    <HiX className="h-6 w-6" />
                  )}
                </button>
                <Navbar.Brand href="/">
                  <span className="tex-sm self-center whitespace-nowrap px-3 font-semibold text-white dark:text-white md:text-xl">
                    SIGECAI
                  </span>
                </Navbar.Brand>
              </div>

              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex justify-start gap-2 text-white"
                    >
                      Asistencia de hoy
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[70vw] md:w-60"
                    align="end"
                    forceMount
                  ></DropdownMenuContent>
                </DropdownMenu>

                <UserNav />
              </div>
            </div>
          </div>
        </Navbar>
      )}
    </header>
  )
}
