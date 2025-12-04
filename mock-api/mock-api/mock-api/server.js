const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

const articles = JSON.parse(fs.readFileSync("mock-api/articles.json", "utf8"));

// List articles
app.get("/mcp/articles", (req, res) => {
  const tenantId = req.query.tenantId;
  const filtered = tenantId
    ? articles.filter(a => a.tenantId === tenantId)
    : articles;
  res.json(filtered);
});

// Simple search endpoint (mock)
app.post("/mcp/articles/search", (req, res) => {
  const { tenantId, query } = req.body;
  const q = (query || "").toLowerCase();

  const filtered = articles.filter(
    a =>
      a.tenantId === tenantId &&
      a.aiUsable &&
      (a.title.toLowerCase().includes(q) ||
        a.topic.toLowerCase().includes(q) ||
        a.body.toLowerCase().includes(q))
  );

  // Pretend these are "chunks"
  const results = filtered.map(a => ({
    articleId: a.id,
    title: a.title,
    topic: a.topic,
    chunkText: a.body.slice(0, 500),
    score: 0.9
  }));

  res.json({ results });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Mock MCP running on ${port}`));
