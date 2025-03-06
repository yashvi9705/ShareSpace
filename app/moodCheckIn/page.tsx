import { MoodCheckIn } from "@/components/mood-check-in"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"


export default function MoodCheckInPage() {
  return (
    
    <div className="container mx-auto px-4 py-8">
       <Sidebar />
       <Header />

       <main className="ml-[260px] pt-14">
     
      <h1 className="text-4xl font-bold mb-4 text-center">Daily Mood Check-In</h1>
      <p className="text-xl text-center mb-8 text-muted-foreground">
        Track your emotional well-being and see how it changes over time.
      </p>
      <MoodCheckIn />
      </main>
    </div>
  )
}

