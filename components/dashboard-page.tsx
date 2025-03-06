"use client"

import { useState, createContext, useContext, useEffect, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { Users, LinkIcon, Trash2, Copy, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


// Mock user context
const UserContext = createContext({ id: "1", name: "Current User" })

interface Group {
  id: number
  name: string
  description: string
  invitelink: string
  members: { id: string; name: string }[]
}


export function GroupManagement() {
  const [groups, setGroups] = useState<Group[]>([])
  const [copiedLink, setCopiedLink] = useState<string | null>(null)
  const user = useContext(UserContext);
  const [isFlipped, setIsFlipped] = useState(false);

  // Fetch groups from the database when the component mounts
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch("/api/groups"); // Your API endpoint to get groups

        const data = await response.json();
        console.log("fetched data:", data);
        localStorage.setItem("groups", JSON.stringify(data));

        setGroups(data); // Set the fetched data into the state

      } catch (error) {
        console.error("Error fetching groups:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while fetching groups.",
          variant: "destructive",
        });
      }
    };

    fetchGroups();
  }, []);



  const createGroup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newGroup = {
      id: groups.length + 1,
      name: formData.get("groupName") as string,
      description: formData.get("description") as string,
      invitelink: `https://invite.com/${formData.get("groupName")?.toString().toLowerCase().replace(/\s+/g, "-")}`,
      members: [{ id: user.id, name: user.name }],
    }


    const response = await fetch("/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGroup),
    });


    setGroups([...groups, newGroup])
    toast({
      title: "Group Created",
      description: "Your new group has been created successfully.",
    })

      ; (event.target as HTMLFormElement).reset()
  }

  const joinGroup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log("Form submitted, entering joinGroup function..."); 
    const formData = new FormData(event.currentTarget)
    const invitelink = formData.get("invitelink") as string
    // const groupToJoin = groups.find((group) => group.invitelink === invitelink)

    const response = await fetch("/groups/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invitelink, userId: user.id, userName: user.name }),
    });
    const joinedGroup = await response.json();
      console.log("Response Data:", joinedGroup);


    if (response.ok) {
      // const joinedGroup = await response.json(); // Get the group with the name and description

      // console.log("join grp Response:", joinedGroup);

      // Only update the name and description of the group in the state
      setGroups((prevGroups) => {
        const groupExists = prevGroups.some(group => group.id === joinedGroup.id);
        if (!groupExists) {
          return [...prevGroups, { id: joinedGroup.id, name: joinedGroup.name, description: joinedGroup.description, invitelink: joinedGroup.invitelink, members: joinedGroup.members }];
        }
        return prevGroups;
      });

      toast({ title: "Joined Group", description: "You have successfully joined the group." });
    } else {
      toast({ title: "Invalid Invite Link", description: "The invite link is not valid.", variant: "destructive" });
    }


    ; (event.target as HTMLFormElement).reset()
  }




  const leaveGroup = async (id: number) => {
      console.log("Leaving group with ID:", id);
      const response = await fetch(`/api/groups/${id}/leave`, {
        method: "DELETE",
      });
  
      const data = await response.json();
      console.log("API Response:", data);
  
      if (response.ok) {
        throw new Error(data.message || "Successfully left the group.");
      }
  
      // Remove from state
      setGroups((prevGroups) => prevGroups.filter((group) => group.id !== id));
  
      toast({
        title: "Left Group",
        description: "You have successfully left the group.",
        variant: "destructive",
      });
  };
  

  
  const copyinvitelink = (link: string) => {
    navigator.clipboard.writeText(link)
    setCopiedLink(link)
    setTimeout(() => setCopiedLink(null), 3000)
    toast({
      title: "Link Copied",
      description: "The invite link has been copied to your clipboard.",
    })
  }


  return (
    <div className="min-h-screen bg-[#1E1E1E] py-12 px-4">

      <div className="container max-w-6xl mx-auto space-y-12 flex flex-col">
        {/* How It Works Section */}
        <div className=" mb-5">
          <h1 className="text-4xl text-centre text-white font-bold">Dashboard</h1>

        </div>

        <div className="flex justify-center">
          <motion.div
            className=" w-full max-w-md"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Create Group Card */}
            <div className={`w-full backface-hidden ${isFlipped ? "hidden" : "block"}`}>
              <Card>
                <CardHeader>
                  <CardTitle>Create a Group</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={createGroup} className="space-y-4">
                    <Label htmlFor="groupName">Group Name</Label>
                    <Input id="groupName" name="groupName" required />
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" />
                    <Button type="submit" className="w-full bg-black">Create Group</Button>
                  </form>
                  <p className="text-sm text-center mt-4">
                    Want to join a group? <span onClick={() => setIsFlipped(true)} className="text-purple-600 cursor-pointer">Click here</span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Join Group Card */}
            <div className={`w-full backface-hidden ${isFlipped ? "block" : "hidden"}`} style={{ transform: "rotateY(180deg)" }}>
              <Card>
                <CardHeader>
                  <CardTitle>Join a Group</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={joinGroup} className="space-y-4">
                    <Label htmlFor="invitelink">Invite Link</Label>
                    <Input id="invitelink" name="invitelink" placeholder="Paste invite link here" required />
                    <Button type="submit" className="w-full bg-black">Join Group</Button>
                  </form>
                  <p className="text-sm text-center mt-4">
                    Want to create a group? <span onClick={() => setIsFlipped(false)} className="text-purple-600 cursor-pointer">Click here</span>
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>



        {/* Available Groups Section */}
        {/* <div>
          <h2 className="text-2xl text-white font-bold mb-6">Available Groups</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <motion.div
                key={group.id}
                className="group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={() => window.location.href = `/task?id=${group.id}`}
              >
                <Card className="bg-white/10 backdrop-blur-md border-none shadow-xl overflow-hidden transition-all duration-300 group-hover:shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-white text-xl font-bold">{group.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-300 mb-4">{group.description}</p>
                    <p>Invite Link: {group.invitelink || "No link available"}</p>
                    <div className="flex items-center justify-between text-gray-400 mb-4">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />

                      </div>
                      <div className="flex items-center">
                        <LinkIcon className="w-4 h-4 mr-2" />
                        <span>Invite Link</span>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors duration-300"
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 text-white border-none">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold">{group.name}</DialogTitle>
                          <DialogDescription className="text-gray-400">{group.description}</DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-4">
                          <div>
                            <Label className="text-gray-300">Invitation Link</Label>
                            <div className="flex mt-1">
                              <Input
                                value={group.invitelink || 'Loading....'}
                                readOnly
                                className="flex-grow bg-gray-700 text-white border-none"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="ml-2 bg-gray-700 hover:bg-gray-600"
                                onClick={() => copyinvitelink(group.invitelink)}
                              >
                                {copiedLink === group.invitelink ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4 text-gray-300" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label className="text-gray-300">Members</Label>
                            <div className="space-y-2 mt-2">
                              {group.members?.map((member) => (
                                <div key={member.id} className="flex items-center space-x-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${member.name}`}
                                    />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-gray-300">{member.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <DialogFooter className="mt-6">
                          <Button
                            variant="destructive"
                            onClick={() => deleteGroup(group.id)}
                            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Group
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div> */}
        <div>
          <h2 className="text-2xl text-white font-bold mb-6">Available Groups</h2>
          {groups.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-md border-none p-8 text-center">
              <p className="text-gray-300">You haven't created or joined any groups yet.</p>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <Card
                  key={group.id}
                  className="bg-white/10 backdrop-blur-md border-none shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-xl font-bold flex justify-between items-start">
                      <span className="truncate mr-2">{group.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                        onClick={(e) => {
                          e.stopPropagation()
                          leaveGroup(group.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-300 line-clamp-2 h-12 mb-2">
                          {group.description || "No description provided"}
                        </p>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Users className="w-4 h-4 mr-2" />
                          <span>{group.members?.length || 0} members</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          className="flex-1 bg-white/10 text-white border-white/20 hover:bg-white/20"
                          
                          onClick={() => {
                            sessionStorage.setItem("currentGroupId", group.id.toString());
                            (window.location.href = `/task?id=${group.id}`)}}
                        >
                          Open Group
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex-1 bg-white/10 text-white border-white/20 hover:bg-white/20"
                            >
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-800 text-white border-none">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-bold">{group.name}</DialogTitle>
                              <DialogDescription className="text-gray-400">{group.description}</DialogDescription>
                            </DialogHeader>
                            <div className="mt-4 space-y-4">
                              <div>
                                <Label className="text-gray-300">Invitation Link</Label>
                                <div className="flex mt-1">
                                  <Input
                                    value={group.invitelink || "Loading..."}
                                    readOnly
                                    className="flex-grow bg-gray-700 text-white border-none"
                                  />
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="ml-2 bg-gray-700 hover:bg-gray-600"
                                    onClick={() => copyinvitelink(group.invitelink)}
                                  >
                                    {copiedLink === group.invitelink ? (
                                      <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <Copy className="h-4 w-4 text-gray-300" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <Label className="text-gray-300">Members</Label>
                                <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
                                  {group.members?.map((member) => (
                                    <div key={member.id} className="flex items-center space-x-2">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage
                                          src={`https://api.dicebear.com/6.x/initials/svg?seed=${member.name}`}
                                        />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <span className="text-gray-300">{member.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <DialogFooter className="mt-6">
                              <Button
                                variant="destructive"
                                onClick={() => leaveGroup(group.id)}
                                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Group
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )


}

