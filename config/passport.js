const passport = require("passport");
const mongoose = require("mongoose");
const { clientID, clientSecret, googleRedirectURI } = require("./keys")
const User = mongoose.model("users");

const GoogleStratagy = require("passport-google-oauth20").Strategy;

passport.use(
    new GoogleStratagy({
        clientID: clientID,
        clientSecret: clientSecret,
        callbackURL: googleRedirectURI,
    },
        async (accessToken, refreshToken, profile, done) => {
            const newUser = {
                googleId: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                image: profile.photos[0].value,
            };
            try {
                let user = await User.findOne({ email: newUser.email });
                if (user) {
                    console.log("Exists ", user);
                    done(null, user);
                }
                else {
                    user = await User.create(newUser);
                    console.log("New User ", user);
                    done(null, user);
                }
            } catch (error) {
                console.log(error);
                done(error);
            }
        })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});