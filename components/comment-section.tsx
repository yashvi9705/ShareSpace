"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Comment } from "../types/complaint"

interface CommentSectionProps {
  comments?: Comment[] // Allow undefined, but default to []
  onAddComment: (text: string) => void
}

export function CommentSection({ comments = [], onAddComment }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      onAddComment(newComment.trim())
      setNewComment("")
    }
  }

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Comments</h4>
      <div className="space-y-2 mb-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-100 p-2 rounded">
              <p className="text-sm">{comment.text}</p>
              <p className="text-xs text-gray-500">
                {comment.author} - {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow"
        />
        <Button type="submit">Post</Button>
      </form>
    </div>
  )
}
