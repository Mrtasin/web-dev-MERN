import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello Dosto");
});

app.get("/tasincoder", (req, res) => {
  res.send("Tasin Coder");
});
app.get("/rajan", (req, res) => {
  res.send("Rajan Coder");
});

app.get("/home", (req, res) => {
    res.send("This is a Home")
});

app.get('/about', (req,res) => {
  res.send('I am Student for CSE Brach')
})


app.listen(8000, () => {
  console.log("Running on PORT : 8000");
});
