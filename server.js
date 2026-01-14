import express from "express";

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/chat", async (req, res) => {
  try {
    const userMsg = req.body.message;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            { role: "user", content: userMsg }
          ]
        })
      }
    );

    const data = await response.json();

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    res.json({ reply: "AI error" });
  }
});

app.listen(10000, () => {
  console.log("Server running on 10000");
});
