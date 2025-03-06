import { ShoppingList } from "@/components/shoppinglist"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"


export default function Page() {
  return (
    <div className="min-h-screen bg-[#1E1E1E]">
      <Sidebar />
      <Header />
      <main className="ml-[260px] pt-14">
      <ShoppingList />
      </main>
    </div>
  )
}

