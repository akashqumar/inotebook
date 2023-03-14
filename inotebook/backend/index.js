const express = require("express");
require("./db");
// const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());

//Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.get("/", (req, res) => {
    res.send("Hello AKash!");
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
