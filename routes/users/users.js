const express = require("express");
const router = express.Router();
const {
  userRegistration,
  userLogin,
  updateUserSubscription,
  uploadAvatar,
  userLogout,
} = require("../../controllers/users");
const { validateUser, validateSubscriptionUser } = require("./validation");
const guard = require("../../helpers/guard");
const limitLogin = require("../../helpers/rate-limit-login");
const wrapError = require("../../helpers/errorhendler");
const upload = require("../../helpers/uploads");

router.post("/signup", validateUser, wrapError(userRegistration));
router.post("/login", validateUser, limitLogin, wrapError(userLogin));
router.post("/logout", guard, wrapError(userLogout));
router.post(
  "/current",
  guard,
  wrapError((req, res, next) => {
    const user = req.user;
    res.status(200).json({
      status: "success",
      cod: 200,
      data: { email: user.email, subscription: user.subscription },
    });
  })
);
router.patch(
  "/subscription",
  guard,
  validateSubscriptionUser,
  wrapError(updateUserSubscription)
);
router.patch("/avatars", guard, upload.single("avatar"), uploadAvatar);

module.exports = router;
