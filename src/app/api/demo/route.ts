import { NextRequest, NextResponse } from 'next/server';
import { SchemaInfo, QueryResult, GeneratedQuery } from '@/types';

// ===== Demo Mode API =====
// Provides a built-in SQLite demo database with sample data for testing

// We'll create an in-memory SQLite database with sample e-commerce data
async function createDemoDatabase() {
    const Database = (await import('better-sqlite3')).default;
    const db = new Database(':memory:');

    // Create tables
    db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      country TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT,
      price REAL,
      stock INTEGER DEFAULT 0
    );

    CREATE TABLE orders (
      id INTEGER PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      total_amount REAL,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE order_items (
      id INTEGER PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id),
      product_id INTEGER REFERENCES products(id),
      quantity INTEGER,
      unit_price REAL
    );

    -- Insert sample users
    INSERT INTO users (name, email, country, created_at) VALUES
      ('Alice Johnson', 'alice@example.com', 'USA', '2026-01-05'),
      ('Bob Smith', 'bob@example.com', 'UK', '2026-01-08'),
      ('Carlos Rivera', 'carlos@example.com', 'Spain', '2026-01-10'),
      ('Diana Chen', 'diana@example.com', 'China', '2026-01-12'),
      ('Evan Williams', 'evan@example.com', 'USA', '2026-01-15'),
      ('Fatima Al-Zahra', 'fatima@example.com', 'UAE', '2026-01-18'),
      ('George Tanaka', 'george@example.com', 'Japan', '2026-01-20'),
      ('Hannah Müller', 'hannah@example.com', 'Germany', '2026-01-22'),
      ('Ivan Petrov', 'ivan@example.com', 'Russia', '2026-01-25'),
      ('Julia Santos', 'julia@example.com', 'Brazil', '2026-01-28');

    -- Insert sample products
    INSERT INTO products (name, category, price, stock) VALUES
      ('Wireless Headphones', 'Electronics', 129.99, 45),
      ('Smart Watch', 'Electronics', 299.99, 22),
      ('Running Shoes', 'Sports', 89.99, 78),
      ('Coffee Maker', 'Kitchen', 59.99, 34),
      ('Yoga Mat', 'Sports', 39.99, 120),
      ('Laptop Stand', 'Electronics', 49.99, 65),
      ('Water Bottle', 'Sports', 24.99, 200),
      ('Desk Lamp', 'Home', 34.99, 55),
      ('Notebook (5-pack)', 'Office', 12.99, 300),
      ('Bluetooth Speaker', 'Electronics', 79.99, 40);

    -- Insert sample orders (January 2026)
    INSERT INTO orders (user_id, total_amount, status, created_at) VALUES
      (1, 429.98, 'completed', '2026-01-06'),
      (2, 89.99, 'completed', '2026-01-09'),
      (3, 174.98, 'completed', '2026-01-11'),
      (4, 299.99, 'completed', '2026-01-13'),
      (5, 64.98, 'completed', '2026-01-16'),
      (6, 209.98, 'completed', '2026-01-19'),
      (7, 129.99, 'completed', '2026-01-21'),
      (8, 94.98, 'completed', '2026-01-23'),
      (9, 349.98, 'pending', '2026-01-26'),
      (10, 79.99, 'completed', '2026-01-29'),
      (1, 159.98, 'completed', '2026-01-30'),
      (3, 49.99, 'completed', '2026-01-31'),
      (5, 299.99, 'shipped', '2026-02-01'),
      (2, 129.99, 'completed', '2026-02-03'),
      (4, 64.98, 'completed', '2026-02-05');

    -- Insert order items
    INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
      (1, 1, 1, 129.99), (1, 2, 1, 299.99),
      (2, 3, 1, 89.99),
      (3, 1, 1, 129.99), (3, 5, 1, 39.99), (3, 8, 1, 34.99),
      (4, 2, 1, 299.99),
      (5, 7, 1, 24.99), (5, 5, 1, 39.99),
      (6, 1, 1, 129.99), (6, 8, 2, 34.99), (6, 9, 1, 12.99),
      (7, 1, 1, 129.99),
      (8, 3, 1, 89.99), (8, 7, 2, 24.99),
      (9, 2, 1, 299.99), (9, 5, 1, 39.99), (9, 8, 1, 34.99),
      (10, 10, 1, 79.99),
      (11, 6, 1, 49.99), (11, 8, 1, 34.99), (11, 7, 3, 24.99),
      (12, 6, 1, 49.99),
      (13, 2, 1, 299.99),
      (14, 1, 1, 129.99),
      (15, 5, 1, 39.99), (15, 7, 1, 24.99);
  `);

    return db;
}

export async function GET() {
    // Return the demo schema
    const schema: SchemaInfo = {
        databaseType: 'sqlite',
        databaseName: 'demo_ecommerce',
        tables: [
            {
                name: 'users',
                rowCount: 10,
                columns: [
                    { name: 'id', type: 'INTEGER', nullable: false, isPrimaryKey: true, isForeignKey: false },
                    { name: 'name', type: 'TEXT', nullable: false, isPrimaryKey: false, isForeignKey: false },
                    { name: 'email', type: 'TEXT', nullable: true, isPrimaryKey: false, isForeignKey: false },
                    { name: 'country', type: 'TEXT', nullable: true, isPrimaryKey: false, isForeignKey: false },
                    { name: 'created_at', type: 'TEXT', nullable: true, isPrimaryKey: false, isForeignKey: false },
                ],
            },
            {
                name: 'products',
                rowCount: 10,
                columns: [
                    { name: 'id', type: 'INTEGER', nullable: false, isPrimaryKey: true, isForeignKey: false },
                    { name: 'name', type: 'TEXT', nullable: false, isPrimaryKey: false, isForeignKey: false },
                    { name: 'category', type: 'TEXT', nullable: true, isPrimaryKey: false, isForeignKey: false },
                    { name: 'price', type: 'REAL', nullable: true, isPrimaryKey: false, isForeignKey: false },
                    { name: 'stock', type: 'INTEGER', nullable: true, isPrimaryKey: false, isForeignKey: false },
                ],
            },
            {
                name: 'orders',
                rowCount: 15,
                columns: [
                    { name: 'id', type: 'INTEGER', nullable: false, isPrimaryKey: true, isForeignKey: false },
                    { name: 'user_id', type: 'INTEGER', nullable: true, isPrimaryKey: false, isForeignKey: true, references: { table: 'users', column: 'id' } },
                    { name: 'total_amount', type: 'REAL', nullable: true, isPrimaryKey: false, isForeignKey: false },
                    { name: 'status', type: 'TEXT', nullable: true, isPrimaryKey: false, isForeignKey: false },
                    { name: 'created_at', type: 'TEXT', nullable: true, isPrimaryKey: false, isForeignKey: false },
                ],
            },
            {
                name: 'order_items',
                rowCount: 27,
                columns: [
                    { name: 'id', type: 'INTEGER', nullable: false, isPrimaryKey: true, isForeignKey: false },
                    { name: 'order_id', type: 'INTEGER', nullable: true, isPrimaryKey: false, isForeignKey: true, references: { table: 'orders', column: 'id' } },
                    { name: 'product_id', type: 'INTEGER', nullable: true, isPrimaryKey: false, isForeignKey: true, references: { table: 'products', column: 'id' } },
                    { name: 'quantity', type: 'INTEGER', nullable: true, isPrimaryKey: false, isForeignKey: false },
                    { name: 'unit_price', type: 'REAL', nullable: true, isPrimaryKey: false, isForeignKey: false },
                ],
            },
        ],
    };

    return NextResponse.json({ success: true, schema });
}

export async function POST(req: NextRequest) {
    try {
        const { sql } = await req.json() as { sql: string };

        if (!sql) {
            return NextResponse.json({ error: 'SQL is required' }, { status: 400 });
        }

        // Safety check
        const blocked = [/\bDROP\b/i, /\bDELETE\b/i, /\bUPDATE\b/i, /\bINSERT\b/i, /\bALTER\b/i];
        for (const p of blocked) {
            if (p.test(sql)) {
                return NextResponse.json({ error: 'Blocked: destructive queries not allowed in demo mode' }, { status: 403 });
            }
        }

        const db = await createDemoDatabase();
        const start = Date.now();

        try {
            const stmt = db.prepare(sql);
            const rows = stmt.all() as Record<string, unknown>[];
            const executionTimeMs = Date.now() - start;
            const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

            db.close();

            const result: QueryResult = {
                columns,
                rows: rows.slice(0, 100),
                rowCount: rows.length,
                executionTimeMs,
            };

            return NextResponse.json({ success: true, result });
        } catch (err) {
            db.close();
            throw err;
        }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}

// Return sample queries for the demo schema
export async function PUT() {
    const sampleQueries: Array<{ question: string; sql: string }> = [
        {
            question: 'Show me the top 5 customers by total revenue',
            sql: `SELECT u.name, u.country, SUM(o.total_amount) AS total_revenue, COUNT(o.id) AS order_count
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed'
GROUP BY u.id, u.name, u.country
ORDER BY total_revenue DESC
LIMIT 5;`,
        },
        {
            question: 'What are the best selling products?',
            sql: `SELECT p.name, p.category, SUM(oi.quantity) AS units_sold, SUM(oi.quantity * oi.unit_price) AS revenue
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
GROUP BY p.id, p.name, p.category
ORDER BY units_sold DESC
LIMIT 10;`,
        },
        {
            question: 'How many orders are in each status?',
            sql: `SELECT status, COUNT(*) AS count, SUM(total_amount) AS total_value
FROM orders
GROUP BY status
ORDER BY count DESC;`,
        },
        {
            question: 'Show revenue by country',
            sql: `SELECT u.country, COUNT(DISTINCT u.id) AS customers, SUM(o.total_amount) AS revenue
FROM users u
JOIN orders o ON u.id = o.user_id
GROUP BY u.country
ORDER BY revenue DESC;`,
        },
        {
            question: 'Find all products with low stock (under 50 units)',
            sql: `SELECT name, category, price, stock
FROM products
WHERE stock < 50
ORDER BY stock ASC;`,
        },
    ];

    return NextResponse.json({ success: true, sampleQueries });
}
