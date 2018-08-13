module.exports = {
    auth :{
        user:process.env.EMAIL_ID,
        pass:process.env.EMAIL_PWD
    },
    facebook:{
        clientID : process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        profileField :['email','displayName'],
        callbackURL  : 'https://desolate-woodland-26129.herokuapp.com/auth/facebook/callback',
        passRequestToCallback: true 
    },
    google:{
        clientID : process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL  : 'https://desolate-woodland-26129.herokuapp.com/auth/google/callback',
        passRequestToCallback: true 
    },
    linkedin:{
        clientID : process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        scope: ['r_emailaddress', 'r_basicprofile'],
        callbackURL  : 'https://desolate-woodland-26129.herokuapp.com/linkedin/callback',
        passRequestToCallback: true 
    },
    github:{
        clientID : process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
       
        callbackURL  : 'http://localhost:3000/auth/github/callback',
        passRequestToCallback: true 
    },
    mongoURI : process.env.MONGO_URI,
    webURL   : process.env.WEB_URL
}

//for retrieving first name and last name => first_name and last_name
