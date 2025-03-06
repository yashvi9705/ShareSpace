
const express = require("express");
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const next = require("next"); // Import Next.js
require("dotenv").config();

const app = express();
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev }); // Initialize Next.js app
const handle = nextApp.getRequestHandler(); // Next.js request handler

const PORT = process.env.PORT || 3000;

const initializePassport = require("./passportConfig");
const { log, group } = require("console");
initializePassport(passport);

// Middleware
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // Protect against client-side JS access
      secure: process.env.NODE_ENV === 'production', // Set to true in production if using HTTPS
      maxAge: 1000 * 60 * 60 * 24 * 7, // Session cookie expires in 7 days
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Wait for Next.js to prepare
nextApp.prepare().then(() => {
  // EJS Routes
  app.get("/", (req, res) => {
    res.render("index");
  });

  app.get("/users/register", checkAuthenticated, (req, res) => {
    res.render("register.ejs");
  });

  app.get("/users/login", checkAuthenticated, (req, res) => {
    console.log(req.session.flash.error);
    res.render("login.ejs");
  });
  

  app.get("/users/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.flash("success_msg", "You have logged out successfully");
      res.redirect("/");
    });
  });

  // app.get("/task", (req, res) => nextApp.render(req, res, "/task"));
  app.get("/task", (req, res) => {
    const groupId = req.query.id; 
    console.log("groupid:", groupId) 
    if (groupId) {
      
      nextApp.render(req, res, "/task", { groupId });
    } else {
      res.status(400).send("Group ID is required.");
    }
  });

  app.get("/task", (req, res) => {
    const groupId = req.query.id; 
    console.log("groupid:", groupId); 
    if (groupId) {
      nextApp.render(req, res, "/task", { groupId });
    } else {
      res.status(400).send("Group ID is required.");
    }
  });
  
  
  app.get("/complain", (req, res) => nextApp.render(req, res, "/complain"));
  app.get("/dashboard", (req, res) => nextApp.render(req, res, "/dashboard"));
  

  app.post("/users/register", async (req, res) => {
    let { name, email, password, password2 } = req.body;
    let errors = [];
    if (!name || !email || !password || !password2) {
      errors.push({ message: "Please enter all fields" });
    }
    if (password.length < 6) {
      errors.push({ message: "Password must be at least 6 characters long" });
    }
    if (password !== password2) {
      errors.push({ message: "Passwords do not match" });
    }
    if (errors.length > 0) {
      res.render("register", { errors, name, email, password, password2 });
    } else {
      hashedPassword = await bcrypt.hash(password, 10);
      pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email],
        (err, results) => {
          if (err) {
            console.log(err);
          }
          if (results.rows.length > 0) {
            return res.render("register", { message: "Email already registered" });
          } else {
            pool.query(
              `INSERT INTO users (name, email, password)
               VALUES ($1, $2, $3) RETURNING id, password`,
              [name, email, hashedPassword],
              (err, results) => {
                if (err) throw err;
                req.flash("success_msg", "You are now registered. Please log in");
                res.redirect("/users/login");
              }
            );
          }
        }
      );
    }
  });

  app.post(
    "/users/login",
    passport.authenticate("local", {
      successRedirect: "/dashboard",
      failureRedirect: "/users/login",
      failureFlash: true,
    }),
    (req, res) => {
      console.log("Logged in user:", req.user);  // Check if user is set
    }
  );






  app.use(bodyParser.json());


app.get("/api/columns", async (req, res) => {
  try {

    const groupId = req.query.id; 
    console.log("Group ID from URL:", groupId); 
    

    const result = await pool.query("SELECT * FROM columns");
    const columns = result.rows;

    // Get tasks for each column based on the selected group ID
    for (const column of columns) {
      const tasksResult = await pool.query(
        "SELECT * FROM tasks WHERE column_id = $1 AND group_id= $2",
        [column.id, groupId]  
      );
      column.tasks = tasksResult.rows;
    }

    res.json(columns);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// add tasks in 
app.post("/api/tasks", async (req, res) => {

  const groupId = req.query.id; 
    console.log("Group ID from tasks:", groupId); 

  const { content, columnId, assignee } = req.body;
  const userId = req.user ? req.user.id : null;  // Get the authenticated user ID

  if (!userId) {
    return res.status(401).send("Unauthorized");  // If no user is logged in
  }

  try {
    const result = await pool.query(
      "INSERT INTO tasks (content, column_id, assignee, user_id, group_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [content, columnId, assignee, userId, groupId]
    );
    res.status(201).json(result.rows[0]);  // Return the newly created task
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// API endpoint to delete a task
app.delete("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.user ? req.user.id : null;  // Get the authenticated user ID

  if (!userId) {
    return res.status(401).send("Unauthorized");  // If no user is logged in
  }

  try {
    // Check if the task belongs to the authenticated user
    const taskResult = await pool.query("SELECT * FROM tasks WHERE id = $1 and user_Id = $2", [id, userId]);
    if (taskResult.rows.length === 0) {
      return res.status(404).send("Task not found");
    }

    // Delete the task
    const deleteResult = await pool.query("DELETE FROM tasks WHERE id = $1 RETURNING *", [id]);
    res.status(200).json(deleteResult.rows[0]);  // Return the deleted task
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});


app.put('/api/tasks/:taskId/assign', async (req, res) => {
  const { taskId } = req.params;
  const { assignee } = req.body;

  try {
    console.log(req.body);
    console.log(req.params)
    // Update the task in the database
    const updateResult = await pool.query(
      "UPDATE tasks SET assignee = $1 WHERE id = $2 RETURNING *",
      [assignee, taskId]
    );

    res.status(200).json(updateResult.rows[0]);
  } catch (error) {
    console.error('Error updating task assignee:', error);
    res.status(500).json({ message: 'Error updating task' });
  }
});





// create grps part 
// Create a group
app.post("/groups", async (req, res) => {
  const { name, description, invitelink } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "INSERT INTO groups (name, description, invitelink) VALUES ($1, $2, $3) RETURNING *",
      [name, description, invitelink]
    );

    const groupId = result.rows[0].id;
    await pool.query(
      "INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)",
      [groupId, userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Join a group
app.post("/groups/join", async (req, res) => {
  const { invitelink } = req.body;
  console.log("Received invite link:", invitelink);
  const userId = req.user.id;
  try {
    const group = await pool.query("SELECT id FROM groups WHERE invitelink = $1", [invitelink]);

    if (group.rows.length === 0) {
      return res.status(400).json({ error: "Invalid invite link" });
    }

    const groupId = group.rows[0].id;
    await pool.query(
      "INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)",
      [groupId, userId]
    );

    res.json({ message: "Joined group successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});
// this is to delete/ leave the group 

app.delete("/api/groups/:id/leave", async (req, res) => {
  try {
    const groupId = req.params.id;
    console.log("Group ID:", groupId);
    const userId = req.user.id; // Get the logged-in user ID

    
    await pool.query("DELETE FROM group_members WHERE group_id = $1 AND user_id = $2", [groupId, userId]);


    const remainingMembers = await pool.query("SELECT COUNT(*) FROM group_members WHERE group_id = $1", [groupId]);

    if (remainingMembers.rows[0].count == 0) {

      await pool.query("DELETE FROM groups WHERE id = $1", [groupId]);
    }

    res.json({ message: "You have left the group." });
  } catch (error) {
    console.error("Error leaving group:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// app.get("/api/groups", async (req, res) => {
//   try {
//     const userId = req.user.id; // Get the logged-in user's ID
    
//     // Fetch groups the user is a part of, along with their members
//     const result = await pool.query(
//         `SELECT g.id, g.name, g.description, g.inviteLink, 
//                 json_agg(u.*) as members
//         FROM groups g
//         LEFT JOIN group_members gm ON g.id = gm.group_id
//         LEFT JOIN users u ON gm.user_id = u.id
//         WHERE gm.user_id = $1
//         GROUP BY g.id`, 
//       [userId]
//     );

//     const groups = result.rows;

//     res.json(groups);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server error");
//   }
// });


app.get("/api/groups", async (req, res) => {
  try {
    const userId = req.user.id;

    // Step 1: Get the groups the user is a part of
    const groupsResult = await pool.query(
      `SELECT g.id, g.name, g.description, g.inviteLink
       FROM groups g
       JOIN group_members gm ON g.id = gm.group_id
       WHERE gm.user_id = $1`,
      [userId]
    );

    const groups = groupsResult.rows;

    // Step 2: Get group members separately
    const groupIds = groups.map((group) => group.id);
    let membersByGroup = {};

    if (groupIds.length > 0) {
      const membersResult = await pool.query(
        `SELECT gm.group_id, u.id, u.name
         FROM group_members gm
         JOIN users u ON gm.user_id = u.id
         WHERE gm.group_id = ANY($1)`,
        [groupIds]
      );

      // Step 3: Organize members by group ID
      membersByGroup = membersResult.rows.reduce((acc, member) => {
        if (!acc[member.group_id]) acc[member.group_id] = [];
        acc[member.group_id].push({ id: member.id, name: member.name });
        return acc;
      }, {});
    }

    // Step 4: Attach members to groups
    const groupsWithMembers = groups.map((group) => ({
      ...group,
      members: membersByGroup[group.id] || [],
    }));

    res.json(groupsWithMembers);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).send("Server error");
  }
});

app.get("/shoppinglist", (req, res) => {
  const groupId = req.query.id; 
  console.log("groupid for shopping list:", groupId) 
  if (groupId) {
  
    nextApp.render(req, res, "/shoppinglist", { groupId });
  } else {
    res.status(400).send("Group ID is required.");
  }
});


app.post('/api/shoppinglist/add', async (req, res) => {
  try {
    const groupId = req.query.id; // Get the group ID from the URL query parameter
    console.log("Group ID from shopping list addd :", groupId); 
    const { name, type } = req.body;   

    if (!groupId || !name || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Insert shopping list item into database
    const query = `
      INSERT INTO shopping_list (type, item, groupId) 
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [type, name, groupId];
    const result = await pool.query(query, values);

    res.status(200).json({ message: "Item added successfully", data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// this is for the mood check in 

app.post("/api/mood/add", async (req, res) => {
  const { mood, comment } = req.body;
  const group_id = req.query.id; // Get the group ID from the URL query parameter
  console.log("Group ID from mood check in :", group_id); 

  if (!mood || !group_id) {
    return res.status(400).json({ error: "Mood, group ID, and user ID are required." });
  }

  try {
    const query = `
      INSERT INTO mood_entries (group_id, mood, comment)
      VALUES ($1, $2, $3) RETURNING *;
    `;
    const values = [group_id, mood, comment || ""];

    const result = await pool.query(query, values);
    res.json({ success: true, entry: result.rows[0] });
  } catch (error) {
    console.error("Error saving mood entry:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/mood", async (req, res) => {
  const group_id = req.query.id;
  console.log("Group ID from mood check in :", group_id); 
  try {
    const result = await pool.query("SELECT * FROM mood_entries WHERE group_id = $1;", [group_id]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching mood entries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});














  // Catch-all route for Next.js
  app.all("*", (req, res) => {
    return handle(req, res);
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

// Authentication Middleware
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/dashboard");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}

