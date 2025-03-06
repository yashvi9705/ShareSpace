"use client"

import { useState, useEffect, type KeyboardEvent } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"

interface ShoppingItem {
  id: number
  name: string
  type: string
  completed: boolean
}



const itemTypes = ["Fruits 🍎", "Vegetables 🥦", "Dairy 🥛", "Meat 🍖", "Snacks 🍫", "Beverages 🥤", "Others"]

export function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    const savedItems = localStorage.getItem("shoppingItems")
    return savedItems ? JSON.parse(savedItems) : []
  })
  const [newItem, setNewItem] = useState("")
  const [selectedType, setSelectedType] = useState(itemTypes[0])

  // useEffect(() => {
  //   fetchItems()
  // }, [])

  // const fetchItems = async () => {
  //   const response = await fetch("/api/shopping-list")
  //   const data = await response.json()
  //   setItems(data)
  // }

  // const addItem = () => {
  //   if (newItem.trim() !== "") {
  //     setItems([...items, { id: Date.now(), name: newItem, type: selectedType, completed: false }])
  //     setNewItem("")
  //   }
  // }

  const getGroupIdFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
};
  

const fetchItems = async () => {
    const groupId = getGroupIdFromURL(); 
    // const groupId = sessionStorage.getItem("currentGroupId"); 
    if (groupId) {
      try {
        const response = await fetch(`/shoppinglist?id=${groupId}`);
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching columns:", error);
      }
    } else {
      console.error("Group ID is required");
    }
  }

  const addItem = async () => {
    const groupId = getGroupIdFromURL();  // Fetch groupId dynamically from the URL
    
  
    if (newItem.trim() !== "") {
      const response = await fetch(`/api/shoppinglist/add?id=${groupId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newItem, type: selectedType }),
      });
  
      // if (response.ok) {
      //   fetchItems(); // Function to refresh the shopping list
      //   setNewItem(""); // Reset the input field
      // }
      if (response.ok) {
        // Optimistically add the new item to the state
        setItems([
          ...items,
          { id: Date.now(), name: newItem, type: selectedType, completed: false },
        ]);
        setNewItem(""); // Reset the input field
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addItem()
    }
  }

  const toggleItem = (id: number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  return (
    <div className="p-6 from-gray-800 to-black min-h-screen text-white bg-[#1E1E1E]">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold">🛒 Shopping List</h1>
      </div>
      <div className="flex flex-col sm:flex-row mb-4 gap-3">
        <Input
          type="text"
          placeholder="Add new item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={handleKeyPress}
          className="bg-gray-700 text-white flex-grow px-4 py-2 rounded-md"
        />
        <Select onValueChange={setSelectedType} defaultValue={selectedType}>
          <SelectTrigger className="bg-gray-700 text-white px-4 py-2 rounded-md">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white">
            {itemTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={addItem} className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md">➕ Add</Button>
      </div>
      {itemTypes.map((type) => (
        <div key={type} className="mt-6">
          {items.some((item) => item.type === type) && (
            <h2 className="text-2xl font-semibold mb-3 border-b pb-1 border-gray-500 sticky top-0  backdrop-blur-md px-2">
              {type}
            </h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items
              .filter((item) => item.type === type)
              .map((item) => (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-gray-900 p-4 rounded-lg shadow-md flex justify-between items-center transition-all hover:shadow-lg hover:scale-105"
                >
                  <div className="flex items-center">
                    <Checkbox
                      id={`item-${item.id}`}
                      checked={item.completed}
                      onCheckedChange={() => toggleItem(item.id)}
                      className="mr-3"
                    />
                    <label
                      htmlFor={`item-${item.id}`}
                      className={`${item.completed ? "line-through text-gray-500" : "text-white"} text-lg`}
                    >
                      {item.name}
                    </label>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-500">
                    <X className="h-5 w-5" />
                  </Button>
                </motion.div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}