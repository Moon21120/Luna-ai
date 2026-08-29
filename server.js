import express from "express";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json({ limit: "20mb" }));
app.use(express.static("."));

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/index.html");
});

app.post("/api/chat", async (req, res) => {
  try {
    const response = await fetch("https://ollama.com/api/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OLLAMA_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "kimi-k3:cloud",
        messages: req.body.messages,
        stream: false
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Luna could not connect to the AI." });
  }
});

app.listen(PORT, () => {
  console.log(`Luna AI running on port ${PORT}`);
});
