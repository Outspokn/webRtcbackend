// controllers/integrityController.js

const fetch = require("node-fetch");

const verifyIntegrityToken = async (req, res) => {
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
};

module.exports = { verifyIntegrityToken };
