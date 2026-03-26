const express = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const wishlistController = require("../controllers/wishlist-controller");

const router = express.Router();

router.use(authMiddleware);
router.get("/", wishlistController.getWishlist);
router.post("/", wishlistController.addWishlistItem);
router.post("/sync", wishlistController.syncWishlist);
router.delete("/", wishlistController.clearWishlist);
router.delete("/:eventId", wishlistController.removeWishlistItem);

module.exports = router;
