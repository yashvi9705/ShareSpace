export interface Comment {
  id: string
  text: string
  author: string
  createdAt: string
}

export interface Complaint {
  id: string
  title: string
  description: string
  status: string
  priority: "low" | "medium" | "high"
  assignee: {
    name: string
    avatar: string
  }
  comments: Comment[]
  votes: number
}

