import { Board } from "@/components/board"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"

export default function Page() {
  return (
    <div className="min-h-screen bg-[#1D2125]">
      <Sidebar />
      <Header />
      <main className="ml-[260px] pt-14">
        <Board />
      </main>
    </div>
  )
}

