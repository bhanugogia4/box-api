require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRouter = require("./routes/authRoute");
const folderRouter = require("./routes/folderRoute");
const fileRouter = require("./routes/fileRoute");

const app = express();

app.use(cors());
app.use(morgan("tiny"));
app.use("/token", authRouter);
app.use("/folder", folderRouter);
app.use("/file", fileRouter);

app.all("*", (req, res) => {
  res.status(404).send(`Can't find ${req.originalUrl} on this server!`);
});

app.listen(8080, () => {
  console.log("Server listening to the requests");
});
