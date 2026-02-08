import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// The 'mysql2' driver acts as the engine that sends raw SQL to your Docker container
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'testuser',
    password: 'testpass',
    database: 'user_db'
});

// Create table on startup
connection.query(
    `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY, 
        username VARCHAR(255), 
        password VARCHAR(255)
    )`,
    (err) => { if (err) console.error("Database initialization failed:", err); }
);

// SIGNUP: Inserts a new row directly into the 'users' table
app.post('/signup', (req, res) => {
    const { user, pass } = req.body;
    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    
    connection.query(sql, [user, pass], (err) => {
        console.log(`Signup: ${user}`);
        if (err) return res.status(500).send("Error creating user.");
        res.send("Signup successful!");
    });
});

// LOGIN: Fetches rows matching the username and password
app.post('/login', (req, res) => {
    const { user, pass } = req.body;
    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    
    connection.query(sql, [user, pass], (err, results) => {
        console.log(`Login attempt: ${user}`);
        if (results.length > 0) res.send("Welcome back!");
        else res.send("Invalid credentials.");
    });
});

// KEYWORD SEARCH: Uses the SQL 'LIKE' operator for pattern matching
app.post('/search', (req, res) => {
    const { word } = req.body;
    // The '%' wildcards allow matching characters before and after the keyword
    const searchTerm = `%${word}%`;
    const sql = "SELECT username FROM users WHERE username LIKE ?";
    
    connection.query(sql, [searchTerm], (err, results) => {
        console.log(`Search for: "${word}"`);
        res.json(results);
    });
});

app.listen(3000, () => console.log("Server active at http://localhost:3000"));