"use client"
// import { Calendar, Layout, Settings, Table, Users } from "lucide-react"
import {List, FileWarning } from "lucide-react";
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faFaceSmile } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const getGroupIdFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
};




export function Sidebar() {
  const [groupId, setGroupId] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupId = async () => {
      // Fetch the groupId dynamically (e.g., from an API or local storage)
      const groupId = getGroupIdFromURL();  // Example, replace with actual logic
      setGroupId(groupId);
    };
    
    fetchGroupId();
  }, []);

  return (
    <div className="fixed left-0 top-0 z-20 h-full w-[260px] border-r bg-[#1E1E1E] text-white">
      <div className="flex h-14 items-center px-4">
        <span className="text-lg font-semibold">ShareSpace</span>
      </div>
      <ScrollArea className="h-[calc(100vh-3.5rem)] p-2">
        <div className="space-y-2">
          <div className="space-y-1">
          <Link href={`/task?id=${groupId}`}>
              <Button variant="ghost" className="w-full justify-start text-gray-300">
                <List className="mr-2 h-4 w-4" />
                Task List
              </Button>
            </Link>
            <Link href="/complain">
              <Button variant="ghost" className="w-full justify-start text-gray-300">
                <FileWarning className="mr-2 h-4 w-4" />
                Complaints
              </Button>
            </Link>
            <Link href={`/shoppinglist?id=${groupId}`}>
              
              <Button variant="ghost" className="w-full justify-start text-gray-300">
              <FontAwesomeIcon icon={faCartShopping} />
                Shopping List
              </Button>
            </Link>
            <Link href={`/moodCheckIn?id=${groupId}`}>
              <Button variant="ghost" className="w-full justify-start text-gray-300">
              <FontAwesomeIcon icon={faFaceSmile} />
                Mood Check-In
              </Button>
            </Link>
          </div>
        </div>

      </ScrollArea>
    </div>


  )
}
