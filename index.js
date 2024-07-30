const path = require("path");
const { createServer } = require("http");
const express = require("express");
const { getIO, initIO } = require("./socket");
const integrityRoutes = require("./routes/integrityRoutes");

const app = express();

app.use(express.json()); // To parse JSON bodies
app.use("/", express.static(path.join(__dirname, "static")));
app.use("/api", integrityRoutes); // Use the integrity routes under /api path

const httpServer = createServer(app);

let port = process.env.PORT || 3500;

initIO(httpServer);

httpServer.listen(port, () => {
  console.log("Server started on", port);
});

getIO();
