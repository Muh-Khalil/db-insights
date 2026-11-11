# 🔍 DB Insights — Plain English to Database Queries

Ask questions in plain English and get instant database insights, powered by a **local AI model** (Ollama/Qwen).

---

## ✨ Features

- 🗣️ **Plain English → SQL** — Type natural language, AI generates SQL
- 🛡️ **Query Safety Guardrails** — Blocks DELETE/DROP/UPDATE, detects injection attempts
- 📊 **Multiple Visualizations** — Table, Bar/Line/Pie charts, JSON view
- 📥 **CSV Export** — Download query results instantly
- 🎮 **Demo Mode** — Built-in e-commerce database, no setup needed
- 🔐 **100% Local** — No data sent to external services
- 🗄️ **Multi-DB** — MySQL, PostgreSQL, SQLite
- 🤖 **AI Insights** — LLM analyzes results in plain English
- 📜 **Query History** — Browse and re-run past queries

---

## 🚀 Quick Start

### 1. Start the App

```bash
cd db-insights
npm run dev
```

Open http://localhost:3500

### 2. Try Demo Mode

Click **"Try Demo Mode"** on the home screen — no database or Ollama required!

The demo has a full e-commerce database with:
- `users` — 10 customers from various countries
- `products` — 10 products in multiple categories
- `orders` — 15 orders with status tracking
- `order_items` — Line items linking products to orders

### 3. Use with Your Own Database

Connect MySQL, PostgreSQL, or SQLite by filling in the connection form.

---

## 🤖 LLM Setup (Ollama)

For AI-powered query generation, install [Ollama](https://ollama.ai):

```bash
# Install Ollama from https://ollama.ai/download

# Start the Ollama server
ollama serve

# Pull a coding model (recommended)
ollama pull qwen2.5-coder:7b

# Alternatives
ollama pull codellama:7b
ollama pull llama3.2:3b
```

> **Without Ollama**: Demo mode still works! You can also write SQL manually using the "Write SQL manually" option in the query interface.

---

## 🏗️ Architecture

```
User (Plain English Question)
        ↓
  Next.js Frontend
        ↓
  /api/schema  → Schema Discovery (reads DB structure)
        ↓
  /api/generate → LLM Query Generation (Ollama local model)
        ↓
  /api/validate → Safety Validation (blocks dangerous queries)
        ↓
  /api/execute  → Query Execution (runs SELECT on your DB)
        ↓
  /api/insights → AI Result Analysis (Ollama summarizes findings)
        ↓
  Results: Table / Chart / JSON + AI Summary
```

---

## 🔒 Security Model

| Check | What it does |
|-------|-------------|
| **Blocked keywords** | Rejects DELETE, DROP, UPDATE, INSERT, TRUNCATE, ALTER |
| **Statement limit** | Only one SQL statement allowed per query |
| **Injection detection** | Detects hex encoding, CHAR(), suspicious comment patterns |
| **LIMIT enforcement** | Warns when no LIMIT clause is present |
| **Double validation** | Validated on frontend → re-validated server-side before execution |
| **Read-only mode** | SQLite opened with `{ readonly: true }` |
| **Query timeout** | MySQL: MAX_EXECUTION_TIME, PostgreSQL: statement_timeout |
| **Row cap** | Maximum 1000 rows returned per query |

---

## 📁 Project Structure

```
db-insights/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── schema/     # Database schema discovery
│   │   │   ├── generate/   # LLM SQL generation
│   │   │   ├── validate/   # Query safety validation
│   │   │   ├── execute/    # Query execution
│   │   │   ├── insights/   # AI result analysis
│   │   │   ├── demo/       # Built-in demo database
│   │   │   └── ollama/     # Ollama status check
│   │   ├── globals.css     # Dark theme + glassmorphism styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Main application page
│   ├── components/
│   │   ├── DbConnect.tsx      # Database connection form
│   │   ├── SchemaViewer.tsx   # Collapsible schema tree
│   │   ├── QueryInterface.tsx # Main query + results orchestrator
│   │   ├── ResultsViewer.tsx  # Table/Chart/JSON viewer
│   │   ├── Pipeline.tsx       # Processing step visualizer
│   │   └── QueryHistory.tsx   # Past queries sidebar
│   └── types/
│       └── index.ts           # All TypeScript types
├── next.config.ts
└── package.json
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React, TypeScript |
| Styling | Vanilla CSS (glassmorphism dark theme) |
| Charts | Recharts |
| Icons | Lucide React |
| LLM Runtime | Ollama (local) |
| LLM Model | Qwen2.5-Coder (recommended) |
| Databases | MySQL (mysql2), PostgreSQL (pg), SQLite (better-sqlite3) |

---

## 📝 Example Questions

Try these in Demo Mode:

- *"Show me the top 5 customers by revenue"*
- *"What are the best selling product categories?"*
- *"How many orders are pending vs completed?"*
- *"Which country generates the most revenue?"*
- *"Find all products with less than 50 units in stock"*
- *"Show me orders from the last 30 days"*

---

## ⚠️ Limitations (MVP)

- LLM accuracy depends on model quality and schema complexity
- Very complex multi-table queries may require prompt tuning
- No authentication layer (add this before production use)
- SQLite must be accessible on the server's file system

---

## 🔮 Roadmap

- [ ] Query cost estimation before execution
- [ ] Fine-tuned prompts per database type
- [ ] Natural language filter refinement ("now filter by USA only")
- [ ] Saved query templates
- [ ] Multi-database joins
- [ ] Authentication + user permissions
- [ ] Scheduled query reports

---

*Built with ❤️ using Next.js + Ollama + Local AI.*
