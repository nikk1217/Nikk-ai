import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serve website
app.use(express.static("public"));

app.get("/", (req,res)=>{
  res.sendFile(path.join(__dirname,"public","index.html"));
});

app.post("/chat", async (req,res)=>{
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${process.env.OPENAI_KEY}`
      },
      body:JSON.stringify({
        model:"gpt-3.5-turbo",
        messages:[
          {role:"system",content:"You are Nikk AI, a helpful assistant."},
          {role:"user",content:userMessage}
        ]
      })
    });

    const data = await response.json();
    res.json({ response: data.choices[0].message.content });

  } catch(err){
    res.json({ response: "Server error" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=> console.log("Running on",PORT));
