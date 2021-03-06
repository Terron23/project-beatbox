
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');
const googleClientID = keys.googleClientID;
const googleClientSecret = keys.googleClientSecret;
const FACEBOOK_APP_ID = keys.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = keys.FACEBOOK_APP_SECRET;
const User = mongoose.model('users');

//Takes user model and passes it into a cookie 
//Use Mongo autogenerated ID
passport.serializeUser((user, done)=>{
done(null, user.id)
});

passport.deserializeUser((id, done)=>{
User.findById(id)
.then((user)=>{
done(null, user);
})
});

// Creates a new instance of google strategy 
// Tells Google how to authenticate Google strategies
passport.use(new GoogleStrategy({
    
    clientID: googleClientID,
    clientSecret: googleClientSecret, 
    //where user is sent after they are granted permissions to appliction
    callbackURL: '/auth/google/callback',
    //Helps google strategy redirect to my application
    proxy: true
},
//Whenever we reach out to our database it is an asynchronous 
async (accessToken, refreshToken, profile, done ) =>{
  
const existingUser = await User.findOne({googleID: profile.id})
if(existingUser){
    console.log(profile.emails[0].value)
done(null, existingUser)
}
    const user = await new User({googleID: profile.id, email: profile.emails[0].value, name: profile.displayName}).save()
     done(null, user);

}));

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    proxy: true
  },
  async (accessToken, refreshToken, profile, done ) =>{
  console.log(accessToken, refreshToken, profile,)
    const existingUser = await User.findOne({FACEBOOK_APP_ID: profile.id})
    if(existingUser){
        console.log(profile)
    done(null, existingUser)
    }
        const user = await new User({facebookID: profile.id, name: profile.displayName}).save()
         done(null, user);
    
    }));

