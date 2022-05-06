const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

// middle wares
const cors = require("cors");
app.use(cors());
require("dotenv").config();
app.use(express.json()); // express js build in body parser

app.get("/", (req, res) => {
  res.send("Hello, Welcome!!");
});

app.listen(port, () => console.log(`running at http://localhost:${port}`));
