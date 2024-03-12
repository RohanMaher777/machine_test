const express = require("express");
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { register,login,generateImages,setOverlayText} = require("../controllers/user.controller");

// User endpoints
router.post('/register', register);
router.post('/login', login);

// Image endpoints
router.post('/generate-images', authenticateToken, generateImages);

// Overlay text endpoint
router.post('/overlay-text', authenticateToken, setOverlayText)

module.exports = router;
