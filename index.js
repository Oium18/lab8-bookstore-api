const express = require('express');
const mysql = require('mysql2');

const app = express();

app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1488',
    database: 'bookstore'
});

db.connect((err) => {
    if (err) {
        console.log('Database connection error:', err);
        return;
    }

    console.log('Connected to MySQL database');
});

app.get('/', (req, res) => {
    res.send('Server is working');
});

// GET - отримати всі книги
app.get('/books', (req, res) => {
    const sql = `
        SELECT 
            books.book_id,
            books.title,
            books.price,
            authors.name AS author_name,
            suppliers.company_name AS supplier_name
        FROM books
        LEFT JOIN authors ON books.author_id = authors.author_id
        LEFT JOIN suppliers ON books.supplier_id = suppliers.supplier_id
    `;

    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        res.json(results);
    });
});

// POST - додати нову книгу
app.post('/books', (req, res) => {
    const { title, price, author_id, supplier_id } = req.body;

    const sql = `
        INSERT INTO books (title, price, author_id, supplier_id)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [title, price, author_id, supplier_id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        res.json({
            message: 'Book added successfully',
            book_id: results.insertId
        });
    });
});

// PUT - оновити книгу
app.put('/books/:id', (req, res) => {
    const { id } = req.params;
    const { title, price, author_id, supplier_id } = req.body;

    const sql = `
        UPDATE books
        SET title = ?, price = ?, author_id = ?, supplier_id = ?
        WHERE book_id = ?
    `;

    db.query(sql, [title, price, author_id, supplier_id, id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        res.json({
            message: 'Book updated successfully'
        });
    });
});

// DELETE - видалити книгу
app.delete('/books/:id', (req, res) => {
    const { id } = req.params;

    const sql = `
        DELETE FROM books
        WHERE book_id = ?
    `;

    db.query(sql, [id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        res.json({
            message: 'Book deleted successfully'
        });
    });
});

// GET - отримати всіх авторів
app.get('/authors', (req, res) => {
    db.query('SELECT * FROM authors', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        res.json(results);
    });
});

// GET - отримати всіх покупців
app.get('/customers', (req, res) => {
    db.query('SELECT * FROM customers', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        res.json(results);
    });
});

// GET - отримати всі замовлення
app.get('/orders', (req, res) => {
    const sql = `
        SELECT 
            orders.order_id,
            orders.order_date,
            customers.full_name AS customer_name,
            customers.email
        FROM orders
        LEFT JOIN customers ON orders.customer_id = customers.customer_id
    `;

    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        res.json(results);
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});