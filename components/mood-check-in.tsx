"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SmilePlus, Smile, Meh, Frown, FolderOpenIcon as FrownOpen } from "lucide-react"

// Types for our mood data
type MoodEntry = {
  id: string
  mood: "great" | "good" | "okay" | "bad" | "awful"
  comment: string
  timestamp: number
}

const getGroupIdFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
};

// Random colors for the comment bubbles
const BUBBLE_COLORS = [
  "bg-pink-500",
  "bg-purple-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-orange-500",
  "bg-red-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-cyan-500",
]

export function MoodCheckIn() {
  const [selectedMood, setSelectedMood] = useState<MoodEntry["mood"] | null>(null)
  const [comment, setComment] = useState("")
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [submitted, setSubmitted] = useState(false)

  // Load existing entries from localStorage on component mount
  // useEffect(() => {
  //   const savedEntries = localStorage.getItem("moodEntries")
  //   if (savedEntries) {
  //     setEntries(JSON.parse(savedEntries))
  //   }
  // }, [])

  useEffect(() => {
    const fetchMoodEntries = async () => {
      try {
        const group_id = getGroupIdFromURL(); 
        const response = await fetch(`/api/mood?id=${group_id}`);
        const data = await response.json();
        setEntries(data);
      } catch (error) {
        console.error("Error fetching mood entries:", error);
      }
    };
  
    fetchMoodEntries();
  }, []);
  

  // const handleSubmit = () => {
  //   if (!selectedMood) return

  //   const newEntry: MoodEntry = {
  //     id: Math.random().toString(36).substring(2, 9),
  //     mood: selectedMood,
  //     comment: comment.trim(),
  //     timestamp: Date.now(),
  //   }

  //   const updatedEntries = [...entries, newEntry]
  //   setEntries(updatedEntries)
  //   localStorage.setItem("moodEntries", JSON.stringify(updatedEntries))

  //   setSelectedMood(null)
  //   setComment("")
  //   setSubmitted(true)
  // }

  const handleSubmit = async () => {
    if (!selectedMood) return;
  
    const group_id = getGroupIdFromURL();  
  
    const newEntry = {
      mood: selectedMood,
      comment: comment.trim(),
      timestamp: Date.now(),
      group_id
    };
  
    try {
      const response = await fetch(`api/mood/add?id=${group_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEntry),
      });
  
      const result = await response.json();
      if (result.success) {
        setEntries((prev) => [result.entry, ...prev]);
        setSelectedMood(null);
        setComment("");
        setSubmitted(true);
      } else {
        console.error("Error submitting mood:", result.error);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };
  

  const getMoodIcon = (mood: MoodEntry["mood"], size = 24) => {
    switch (mood) {
      case "great":
        return <SmilePlus size={size} className="text-green-500" />
      case "good":
        return <Smile size={size} className="text-emerald-500" />
      case "okay":
        return <Meh size={size} className="text-yellow-500" />
      case "bad":
        return <Frown size={size} className="text-orange-500" />
      case "awful":
        return <FrownOpen size={size} className="text-red-500" />
    }
  }

  const getMoodText = (mood: MoodEntry["mood"]) => {
    switch (mood) {
      case "great":
        return "Great"
      case "good":
        return "Good"
      case "okay":
        return "Okay"
      case "bad":
        return "Bad"
      case "awful":
        return "Awful"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Weekly Mood Check-In</h1>

      <div className="space-y-8">
        {/* Check-in Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Check In</h2>
          {submitted ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Thanks for checking in!</h2>
              <p className="mb-6">Your mood has been recorded anonymously.</p>
              <Button onClick={() => setSubmitted(false)}>Check in again</Button>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">How are you feeling today?</h2>
                  <div className="grid grid-cols-5 gap-2 md:gap-4">
                    {(["great", "good", "okay", "bad", "awful"] as const).map((mood) => (
                      <Button
                        key={mood}
                        variant={selectedMood === mood ? "default" : "outline"}
                        className="flex flex-col items-center py-6 h-auto"
                        onClick={() => setSelectedMood(mood)}
                      >
                        <div className="mb-2">{getMoodIcon(mood, 32)}</div>
                        <span>{getMoodText(mood)}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">Share your thoughts (optional)</h2>
                  <Textarea
                    placeholder="What's on your mind? Your comment will be shared anonymously."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <Button onClick={handleSubmit} disabled={!selectedMood} className="w-full" size="lg">
                  Submit
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Team Mood Board Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Mood Board</h2>
          <Card>
            <CardContent className="pt-6">
              {entries.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No mood entries yet. Be the first to check in!
                </div>
              ) : (
                <>
                  <div className="flex justify-center gap-4 mb-8">
                    {(["great", "good", "okay", "bad", "awful"] as const).map((mood) => {
                      const count = entries.filter((entry) => entry.mood === mood).length
                      return (
                        <div key={mood} className="flex flex-col items-center">
                          {getMoodIcon(mood, 28)}
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="relative min-h-[300px] p-4 bg-muted/30 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Anonymous Comments</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {entries
                        .filter((entry) => entry.comment.trim() !== "")
                        .map((entry, index) => (
                          <div
                            key={entry.id}
                            className={`${
                              BUBBLE_COLORS[index % BUBBLE_COLORS.length]
                            } text-white px-4 py-2 rounded-full text-sm font-medium animate-fade-in`}
                            style={{
                              animationDelay: `${index * 0.1}s`,
                              fontSize: `${Math.min(1 + (entry.comment.length % 5) * 0.1, 1.3)}rem`,
                            }}
                          >
                            {entry.comment}
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

