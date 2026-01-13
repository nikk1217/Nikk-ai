import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are Nikk AI, a helpful assistant." },
        { role: "user", content: message }
      ]
    });

    res.json({
      reply: response.choices[0].message.content
    });
  } catch (err) {
    console.error(err);
    res.json({ reply: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.send("Nikk AI is running 🚀");
});

app.listen(10000, () => {
  console.log("Server running on port 10000");
});
