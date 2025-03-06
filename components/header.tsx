import { Bell, Filter, HelpCircle, Search, Share2, LogOut, Menu } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
  return (
    <header className="fixed left-60 right-0 top-0 z-30 flex h-14 items-center justify-between bg-[#1E1E1E] px-4 ">
      <div className="flex items-center gap-2">
        {/* <Button variant="ghost" size="icon" className="text-gray-400">
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-white">ShareSpace</h1> */}
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search..." className="w-64 bg-[#2A2D2E] pl-8 text-white placeholder-gray-400 rounded-md" />
        </div>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-[#2A2D2E]">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-[#2A2D2E]">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-[#2A2D2E]">
          <HelpCircle className="h-4 w-4" />
        </Button>
        <Link href="/users/logout">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-[#2A2D2E]">
            <LogOut className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </header>
  )
}
