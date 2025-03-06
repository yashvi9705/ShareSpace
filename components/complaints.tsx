// "use client"

// import { useState } from "react"
// import { MoreHorizontal, MessageCircle, ThumbsUp } from "lucide-react"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { AddComplaintDialog } from "./add-complaint-dialog"
// import { EditComplaintDialog } from "./edit-complaint-dialog"
// import { CommentSection } from "./comment-section"
// import type { Complaint } from "../types/complaint"

// const initialComplaints: Complaint[] = [
//   {
//     id: "1",
//     title: "Website not loading properly",
//     description: "Customer reported issues with accessing the main dashboard",
//     status: "new",
//     priority: "high",
//     assignee: {
//       name: "Alex",
//       avatar: "/placeholder-user.jpg",
//     },
//     comments: [], 
//     votes: 0,
//   },
//   {
//     id: "2",
//     title: "Payment processing error",
//     description: "Transaction failed but amount deducted",
//     status: "new",
//     priority: "high",
//     assignee: {
//       name: "Sam",
//       avatar: "/placeholder-user.jpg",
//     },
//     comments: [],
//     votes: 0,
//   },
//   {
//     id: "3",
//     title: "Account login issues",
//     description: "Users unable to reset password",
//     status: "in-progress",
//     priority: "medium",
//     assignee: {
//       name: "Taylor",
//       avatar: "/placeholder-user.jpg",
//     },
//     comments: [],
//     votes: 0,
//   },
//   {
//     id: "4",
//     title: "Mobile app crash",
//     description: "App crashes on startup for iOS users",
//     status: "resolved",
//     priority: "low",
//     assignee: {
//       name: "Jordan",
//       avatar: "/placeholder-user.jpg",
//     },
//     comments: [],
//     votes: 0,
//   },
// ]

// export function Complaints() {
//   const [complaints, setComplaints] = useState(initialComplaints)

//   const handleAddComplaint = (newComplaint: Complaint) => {
//     setComplaints((prev) => [...prev, newComplaint])
//   }

//   const handleEditComplaint = (id: string, updatedComplaint: Partial<Complaint>) => {
//     setComplaints((prev) => {
//       return prev.map((complaint) =>
//         complaint.id === id ? { ...complaint, ...updatedComplaint } : complaint,
//       )
//     })
//   }

//   const handleDeleteComplaint = (id: string) => {
//     setComplaints((prev) => prev.filter((complaint) => complaint.id !== id))
//   }

//   const handleAddComment = (complaintId: string, text: string) => {
//     setComplaints((prev) => {
//       return prev.map((complaint) =>
//         complaint.id === complaintId
//           ? {
//               ...complaint,
//               comments: [
//                 ...complaint.comments,
//                 {
//                   id: Math.random().toString(36).substr(2, 9),
//                   text,
//                   author: "Current User",
//                   createdAt: new Date().toISOString(),
//                 },
//               ],
//             }
//           : complaint,
//       )
//     })
//   }

//   const handleVote = (id: string) => {
//     setComplaints((prev) => {
//       return prev.map((complaint) =>
//         complaint.id === id ? { ...complaint, votes: complaint.votes + 1 } : complaint,
//       )
//     })
//   }

//   return (
//     <div className="mt-8 p-4 ">
//        <div className="mb-8 flex justify-between">
//     <h1 className="text-3xl font-bold text-white mb-2">Complaints Dashboard</h1>
//     <AddComplaintDialog onAddComplaint={handleAddComplaint} status={""} />
//   </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {complaints.map((complaint) => (
//           <div
//             key={complaint.id}
//             className="bg-white rounded-lg p-4 shadow-sm w-full"
//           >
//             <div className="flex justify-between items-start mb-2">
//               <h3 className="font-medium">{complaint.title}</h3>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" size="icon">
//                     <MoreHorizontal className="h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <EditComplaintDialog complaint={complaint} onEditComplaint={handleEditComplaint} />
//                   <DropdownMenuItem onSelect={() => handleDeleteComplaint(complaint.id)}>
//                     Delete
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//             <p className="text-sm text-gray-500 mb-4">{complaint.description}</p>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <Avatar className="h-6 w-6">
//                   <AvatarImage src={complaint.assignee.avatar} />
//                   <AvatarFallback>{complaint.assignee.name[0]}</AvatarFallback>
//                 </Avatar>
//                 <div className="flex items-center text-gray-500 text-sm gap-2">
//                   <div className="flex items-center">
//                     <MessageCircle className="h-4 w-4 mr-1" />
//                     {complaint.comments.length}
//                   </div>
//                   <div className="flex items-center">
//                     <ThumbsUp className="h-4 w-4 mr-1" />
//                     {complaint.votes}
//                   </div>
//                 </div>
//               </div>
//               <div
//                 className={`px-2 py-1 rounded text-xs font-medium ${
//                   complaint.priority === "high"
//                     ? "bg-red-100 text-red-700"
//                     : complaint.priority === "medium"
//                     ? "bg-yellow-100 text-yellow-700"
//                     : "bg-green-100 text-green-700"
//                 }`}
//               >
//                 {complaint.priority}
//               </div>
//             </div>
//             <Button
//               variant="ghost"
//               size="sm"
//               className="mt-2"
//               onClick={() => handleVote(complaint.id)}
//             >
//               <ThumbsUp className="h-4 w-4 mr-1" /> Vote
//             </Button>
//             <CommentSection
//               comments={complaint.comments}
//               onAddComment={(text) => handleAddComment(complaint.id, text)}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { MoreHorizontal, MessageCircle, ThumbsUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AddComplaintDialog } from "./add-complaint-dialog"
import { EditComplaintDialog } from "./edit-complaint-dialog"
import { CommentSection } from "./comment-section"
import type { Complaint } from "../types/complaint"

const initialComplaints: Complaint[] = [
  // {
  //   id: "1",
  //   title: "Website not loading properly",
  //   description: "Customer reported issues with accessing the main dashboard",
  //   status: "new",
  //   priority: "high",
  //   assignee: {
  //     name: "Alex",
  //     avatar: "/placeholder-user.jpg",
  //   },
  //   comments: [],
  //   votes: 0,
  // },
  // {
  //   id: "2",
  //   title: "Payment processing error",
  //   description: "Transaction failed but amount deducted",
  //   status: "new",
  //   priority: "high",
  //   assignee: {
  //     name: "Sam",
  //     avatar: "/placeholder-user.jpg",
  //   },
  //   comments: [],
  //   votes: 0,
  // },
  // {
  //   id: "3",
  //   title: "Account login issues",
  //   description: "Users unable to reset password",
  //   status: "in-progress",
  //   priority: "medium",
  //   assignee: {
  //     name: "Taylor",
  //     avatar: "/placeholder-user.jpg",
  //   },
  //   comments: [],
  //   votes: 0,
  // },
  // {
  //   id: "4",
  //   title: "Mobile app crash",
  //   description: "App crashes on startup for iOS users",
  //   status: "resolved",
  //   priority: "low",
  //   assignee: {
  //     name: "Jordan",
  //     avatar: "/placeholder-user.jpg",
  //   },
  //   comments: [],
  //   votes: 0,
  // },
]

export function Complaints() {
  // Load complaints from localStorage on initial load
  const loadComplaints = () => {
    const savedComplaints = localStorage.getItem("complaints")
    if (savedComplaints) {
      return JSON.parse(savedComplaints)
    } else {
      return initialComplaints
    }
  }

  const [complaints, setComplaints] = useState<Complaint[]>(loadComplaints)

  // Save complaints to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("complaints", JSON.stringify(complaints))
  }, [complaints])

  const handleAddComplaint = (newComplaint: Complaint) => {
    const complaintWithVotes = { ...newComplaint, votes: newComplaint.votes || 0 };
    setComplaints((prev) => [...prev, newComplaint])
  }

  const handleEditComplaint = (id: string, updatedComplaint: Partial<Complaint>) => {
    setComplaints((prev) => {
      return prev.map((complaint) =>
        complaint.id === id ? { ...complaint, ...updatedComplaint } : complaint,
      )
    })
  }

  const handleDeleteComplaint = (id: string) => {
    setComplaints((prev) => prev.filter((complaint) => complaint.id !== id))
  }

  // const handleAddComment = (complaintId: string, text: string) => {
  //   setComplaints((prev) => {
  //     return prev.map((complaint) =>
  //       complaint.id === complaintId
  //         ? {
  //             ...complaint,
  //             comments: [
  //               ...complaint.comments,
  //               {
  //                 id: Math.random().toString(36).substr(2, 9),
  //                 text,
  //                 author: "Current User",
  //                 createdAt: new Date().toISOString(),
  //               },
  //             ],
  //           }
  //         : complaint,
  //     )
  //   })
  // }

  const handleAddComment = (complaintId: string, text: string) => {
    if (text.trim()) { // Ensure text is not empty or just spaces
      setComplaints((prev) => {
        return prev.map((complaint) =>
          complaint.id === complaintId
            ? {
                ...complaint,
                comments: [
                  ...(complaint.comments || []), // Ensure comments is always an array
                  {
                    id: Math.random().toString(36).substr(2, 9), // Ensure a valid unique ID
                    text,
                    author: "Current User", // You can update this to the actual user's name
                    createdAt: new Date().toISOString(),
                  },
                ],
              }
            : complaint,
        );
      });
    } else {
      // Optional: Handle empty comment attempt (e.g., show an alert)
      console.warn("Comment text cannot be empty.");
    }
  };
  


  const handleVote = (id: string) => {
    setComplaints((prev) => {
      return prev.map((complaint) =>
        complaint.id === id ? { ...complaint, votes: (complaint.votes || 0) + 1 } : complaint,
      )
    })
  }

  return (
    <div className="mt-8 p-4 ">
      <div className="mb-8 flex justify-between">
        <h1 className="text-3xl font-bold text-white mb-2">Complaints Dashboard</h1>
        <AddComplaintDialog onAddComplaint={handleAddComplaint} status={""} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {complaints.map((complaint) => (
          <div
            key={complaint.id}
            className="bg-white rounded-lg p-4 shadow-sm w-full"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{complaint.title}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <EditComplaintDialog complaint={complaint} onEditComplaint={handleEditComplaint} />
                  <DropdownMenuItem onSelect={() => handleDeleteComplaint(complaint.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm text-gray-500 mb-4">{complaint.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={complaint.assignee.avatar} />
                  <AvatarFallback>{complaint.assignee.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex items-center text-gray-500 text-sm gap-2">
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {complaint.comments.length}
                  </div>
                  <div className="flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {complaint.votes}
                  </div>
                </div>
              </div>
              <div
                className={`px-2 py-1 rounded text-xs font-medium ${
                  complaint.priority === "high"
                    ? "bg-red-100 text-red-700"
                    : complaint.priority === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {complaint.priority}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => handleVote(complaint.id)}
            >
              <ThumbsUp className="h-4 w-4 mr-1" /> Vote
            </Button>
            <CommentSection
              comments={complaint.comments}
              onAddComment={(text) => handleAddComment(complaint.id, text)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

