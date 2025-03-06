-- Columns table
CREATE TABLE columns (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL
);
drop table columns

-- Tasks table
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  column_id INT REFERENCES columns(id),
  assignee VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE tasks ADD COLUMN user_id INT REFERENCES users(id);
ALTER TABLE tasks ADD COLUMN position INT;
ALTER TABLE tasks ADD COLUMN group_id INT REFERENCES groups(id) ON DELETE CASCADE;

INSERT INTO tasks (content, column_id, assignee, user_id, group_id) VALUES
('Create  page', 1, 'Demo user', 2, 1) 

      

-- Insert fake data into the columns table
INSERT INTO columns (title) VALUES
('To Do'),
('Doing'),
('Done');

-- Insert fake data into the tasks table with user_id
INSERT INTO tasks (content, column_id, assignee, user_id) VALUES
('Create landing page', 1, 'Alice', 1),  -- Alice's task in "To Do"
('Develop user authentication', 2, 'Bob', 2),  -- Bob's task in "Doing"
('Design database schema', 2, 'Charlie', 2),  -- Charlie's task in "Doing"
('Fix login bug', 3, 'David', 2),  -- David's task in "Done"
('Write API documentation', 1, 'Alice', 1),  -- Alice's task in "To Do"
('Test user registration flow', 3, 'Charlie', 2),  -- Charlie's task in "Done"
('Deploy website', 3, 'Bob', 2);  -- Bob's task in "Done"


select * from tasks

drop table tasks


const getGroupIdFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
};
  

const fetchItems = async () => {
    const groupId = getGroupIdFromURL();  
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
  
      if (response.ok) {
        fetchItems(); // Function to refresh the shopping list
        setNewItem(""); // Reset the input field
      }
    }
  };