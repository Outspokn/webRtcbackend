const path = require("path");
const { createServer } = require("http");
const express = require("express");
const { getIO, initIO } = require("./socket");

const app = express();

app.use("/", express.static(path.join(__dirname, "static")));

const httpServer = createServer(app);

let port = process.env.PORT || 3500;

initIO(httpServer);

httpServer.listen(port, () => {
  console.log("Server started on", port);
});

getIO();

// Route to verify integrity token
app.post("/verify-integrity", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const response = await fetch(
      "https://playintegrity.googleapis.com/v1beta1/verifyIntegrityToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_SERVER_API_KEY`, // Replace with your server API key
        },
        body: JSON.stringify({ integrityToken: token }),
      }
    );

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();

    // Check the integrity verdicts
    if (
      data.tokenPayloadIntegrityVerdict === "OK" &&
      data.accountDetailsMatchVerdict === "OK"
    ) {
      res.json({ isValid: true });
    } else {
      res.json({ isValid: false });
    }
  } catch (error) {
    console.error("Failed to verify integrity token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
