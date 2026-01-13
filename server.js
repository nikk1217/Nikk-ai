import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();   // 👈 THIS MUST BE ON TOP
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serve index.html

const PORT = process.env.PORT || 10000;

// Home page
app.get("/", (req, res) => {
  res.sendFile(new URL("./public/index.html", import.meta.url).pathname);
});

// Chat API
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log("Nikk AI running on port " + PORT);
});
