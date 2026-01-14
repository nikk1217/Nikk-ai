import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 10000;

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
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful AI assistant." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    // ✅ CORRECT PATH
    const reply =
      data?.choices?.[0]?.message?.content || "No reply from AI";

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Nikk AI running on port ${PORT}`);
});
