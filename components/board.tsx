
"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { MoreHorizontal, Plus, X, Trash2, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"


interface Task {
  position: any
  id: string
  content: string
  group?: string
  assignee?: string
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}


export function Board() {
  //old 
  // const [columns, setColumns] = useState<Column[]>(() => {
  //   const savedColumns = localStorage.getItem("columns")
  //   return savedColumns ? JSON.parse(savedColumns) : initialColumns
  // })

  //new
  const [columns, setColumns] = useState<Column[]>([]);
  


  const [addingToColumn, setAddingToColumn] = useState<string | null>(null)
  const [newTaskContent, setNewTaskContent] = useState("")
  const [names, setNames] = useState<string[]>(["Alice", "Bob", "Charlie", "David"])
  const [newName, setNewName] = useState("")

  const getGroupIdFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  };
  

  // useEffect(() => {
  //   localStorage.setItem("columns", JSON.stringify(columns))
  // }, [columns])

  useEffect(() => {
  // Fetch columns and tasks from the backend when the component mounts
  const fetchColumns = async () => {
    // const groupId = getGroupIdFromURL();  
    const groupId = sessionStorage.getItem("currentGroupId");
    if (groupId) {
      try {
        const response = await fetch(`/api/columns?id=${groupId}`);
        const data = await response.json();
        setColumns(data);
      } catch (error) {
        console.error("Error fetching columns:", error);
      }
    } else {
      console.error("Group ID is required");
    }
  };
  fetchColumns();
}, []);



  // const onDragEnd = (result: any) => {
  //   if (!result.destination) return

  //   const { source, destination } = result
  //   const sourceColumn = columns.find((col) => col.id === source.droppableId)
  //   const destColumn = columns.find((col) => col.id === destination.droppableId)

  //   if (!sourceColumn || !destColumn) return

  //   const newColumns = [...columns]
  //   const sourceTask = sourceColumn.tasks[source.index]

  //   newColumns.find((col) => col.id === source.droppableId)!.tasks.splice(source.index, 1)
  //   newColumns.find((col) => col.id === destination.droppableId)!.tasks.splice(destination.index, 0, sourceTask)

  //   setColumns(newColumns)
  // }

  const onDragEnd = async (result: any) => {
    // Check if there is a valid destination
    if (!result.destination) return;
  
    const { source, destination } = result;
  
    // Find the source and destination columns
    const sourceColumn = columns.find((col) => col.id === source.droppableId);
    const destColumn = columns.find((col) => col.id === destination.droppableId);
  
    if (!sourceColumn || !destColumn) return;
  
    // Clone the columns to avoid mutating state directly
    const updatedColumns = [...columns];
  
    // Find and remove the task from the source column
    const [movedTask] = updatedColumns.find((col) => col.id === source.droppableId)!.tasks.splice(source.index, 1);
  
    // Insert the task into the destination column at the new index
    updatedColumns.find((col) => col.id === destination.droppableId)!.tasks.splice(destination.index, 0, movedTask);
  
    // Update the state with the new column order
    setColumns(updatedColumns);
  
    try {
      // Create a payload with the updated columns and tasks
      const updatedColumnsData = updatedColumns.map((column) => {
        return {
          id: column.id,
          tasks: column.tasks.map((task) => ({
            ...task,
            column_id: column.id,  // Ensure the task has the correct column_id
            position: task.position, // You may want to track position for tasks
          })),
        };
      });
  
      // Send the updated columns data to the backend
      const response = await fetch('/api/update-columns', {
        method: 'PUT', // Use PUT for updating data
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ columns: updatedColumnsData }),
      });
  
      // Check if the update was successful
      if (response.ok) {
        console.log('Database updated successfully');
      } else {
        console.error('Error updating the database');
      }
    } catch (error) {
      console.error("Error updating column order:", error);
    }
  };
  
  
  

  const startAddingCard = (columnId: string) => {
    setAddingToColumn(columnId)
    setNewTaskContent("")
  }

  const cancelAddingCard = () => {
    setAddingToColumn(null)
    setNewTaskContent("")
  }

  // const addCard = (columnId: string) => {
  //   if (!newTaskContent.trim()) return

  //   const newTask: Task = {
  //     id: Date.now().toString(),
  //     content: newTaskContent.trim(),
  //   }

  //   setColumns(
  //     columns.map((column) => {
  //       if (column.id === columnId) {
  //         return {
  //           ...column,
  //           tasks: [...column.tasks, newTask],
  //         }
  //       }
  //       return column
  //     }),
  //   )

  //   setAddingToColumn(null)
  //   setNewTaskContent("")
  // }

  const addCard = async (columnId: string) => {
    if (!newTaskContent.trim()) return;
  
    const newTask = {
      content: newTaskContent.trim(),
      columnId: columnId,
      assignee: "", // Default assignee or get from the UI
    };
    const groupId = getGroupIdFromURL();  
  
    try {
      const response = await fetch(`/api/tasks?id=${groupId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      const data = await response.json();
      // Update the state with the new task
      setColumns((prevColumns) => {
        return prevColumns.map((col) => {
          if (col.id === columnId) {
            return { ...col, tasks: [...col.tasks, data] };
          }
          return col;
        });
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  
// old 
  // const deleteTask = (columnId: string, taskId: string) => {
  //   setColumns(
  //     columns.map((column) => {
  //       if (column.id === columnId) {
  //         return {
  //           ...column,
  //           tasks: column.tasks.filter((task) => task.id !== taskId),
  //         }
  //       }
  //       return column
  //     }),
  //   )
  // }

// new
const deleteTask = async (columnId: string, taskId: string) => {
  try {
    // Send DELETE request to the API
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // To send cookies for session-based auth
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      alert(`Failed to delete task: ${errorMessage}`);
      return;
    }

    // If successful, update the state by removing the task from the column
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              tasks: column.tasks.filter((task) => task.id !== taskId),
            }
          : column
      )
    );
  } catch (error) {
    console.error('Error deleting task:', error);
    alert('There was an error deleting the task.');
  }
};


const assignTask = async (columnId: string, taskId: string, assignee: string) => {
  // Update state with new assignee
  setColumns(
    columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: column.tasks.map((task) => {
            if (task.id === taskId) {
              return { ...task, assignee }
            }
            return task
          }),
        }
      }
      return column
    }),
  )

  try {
    // Send the updated assignee to the backend
    const response = await fetch(`/api/tasks/${taskId}/assign`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ assignee }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      alert(`Failed to assign task: ${errorMessage}`);
      return;
    }
  } catch (error) {
    console.error("Error assigning task:", error);
    alert("There was an error assigning the task.");
  }
}


  // const assignTask = (columnId: string, taskId: string, assignee: string) => {
  //   setColumns(
  //     columns.map((column) => {
  //       if (column.id === columnId) {
  //         return {
  //           ...column,
  //           tasks: column.tasks.map((task) => {
  //             if (task.id === taskId) {
  //               return { ...task, assignee }
  //             }
  //             return task
  //           }),
  //         }
  //       }
  //       return column
  //     }),
  //   )
  // }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, columnId: string) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      addCard(columnId)
    }
    if (e.key === "Escape") {
      cancelAddingCard()
    }
  }

  const addNewName = () => {
    if (newName.trim() && !names.includes(newName.trim())) {
      setNames([...names, newName.trim()])
      setNewName("")
    }
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] gap-4 overflow-x-auto p-4 bg-[#1E1E1E]">
      <DragDropContext onDragEnd={onDragEnd}>
        {columns.map((column) => (
          <div key={column.id} className="w-[272px] flex-shrink-0">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">{column.title}</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {column.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-[#22272B] p-2 text-sm text-gray-300"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span>{task.content}</span>
                            <div className="flex items-center space-x-2">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    {task.assignee ? (
                                      <Badge variant="secondary">{task.assignee}</Badge>
                                    ) : (
                                      <UserPlus className="h-4 w-4 text-gray-400" />
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-48 p-2">
                                  <div className="flex flex-col gap-2">
                                    {names.map((name) => (
                                      <Button
                                        key={name}
                                        variant="ghost"
                                        className="justify-start"
                                        onClick={() => assignTask(column.id, task.id, name)}
                                      >
                                        {name}
                                      </Button>
                                    ))}
                                    <div className="flex items-center gap-2 mt-2">
                                      <Input
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder="Add new name"
                                        className="flex-grow"
                                      />
                                      <Button onClick={addNewName} size="sm">
                                        Add
                                      </Button>
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteTask(column.id, task.id)}
                                className="h-8 w-8 text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {task.assignee && (
                            <div className="text-xs text-gray-400 flex items-center">Assigned to: {task.assignee}</div>
                          )}
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  {addingToColumn === column.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={newTaskContent}
                        onChange={(e) => setNewTaskContent(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, column.id)}
                        placeholder="Enter a title for this card..."
                        className="min-h-[60px] resize-none bg-[#22272B] text-sm text-white"
                        autoFocus
                      />
                      <div className="flex items-center gap-2">
                        <Button onClick={() => addCard(column.id)} className="bg-blue-600 text-white hover:bg-blue-700">
                          Add card
                        </Button>
                        <Button variant="ghost" size="icon" onClick={cancelAddingCard} className="text-gray-400">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm text-gray-400 hover:bg-[#22272B]"
                      onClick={() => startAddingCard(column.id)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add a card
                    </Button>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  )
}


