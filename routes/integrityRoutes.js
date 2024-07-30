// routes/integrityRoutes.js

const express = require("express");
const { verifyIntegrityToken } = require("../controllers/integrityController");

const router = express.Router();

router.post("/verify-integrity", verifyIntegrityToken);

module.exports = router;
