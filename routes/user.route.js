const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");
dotenv.config();

const userRouter = express.Router(); // Session middleware setup
userRouter.use(
  require("express-session")({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and restore authentication state from session
userRouter.use(passport.initialize());
userRouter.use(passport.session());

// Passport configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      // Here you would typically find or create a user in your database

      const userData = {
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        picture: profile.photos[0].value,
        accessToken,
      };

      console.log(userData);
      console.log(profile);
      return cb(null, userData);
    }
  )
);

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Initial Google OAuth login route
userRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback route
userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    successRedirect: "http://localhost:5173/home",
  })
);

// Protected route example
userRouter.get("/profile", isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

// Logout route
// Logout route
userRouter.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });
});

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Not authenticated" });
}

module.exports = { userRouter };
