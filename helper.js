const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_mysql_username',
    password: 'your_mysql_password',
    database: 'notes_keeper'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL database');
});

// Routes
// Get all notes
app.get('/api/notes', (req, res) => {
    const sql = 'SELECT * FROM notes';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Get note by ID
app.get('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM notes WHERE id = ?';
    db.query(sql, id, (err, result) => {
        if (err) throw err;
        res.json(result[0]);
    });
});

// Create a new note
app.post('/api/notes', (req, res) => {
    const { title, content } = req.body;
    const sql = 'INSERT INTO notes (title, content) VALUES (?, ?)';
    db.query(sql, [title, content], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Note created successfully', id: result.insertId });
    });
});

// Update a note
app.put('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    const { title, content } = req.body;
    const sql = 'UPDATE notes SET title = ?, content = ? WHERE id = ?';
    db.query(sql, [title, content, id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Note updated successfully' });
    });
});

// Delete a note
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM notes WHERE id = ?';
    db.query(sql, id, (err, result) => {
        if (err) throw err;
        res.json({ message: 'Note deleted successfully' });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});