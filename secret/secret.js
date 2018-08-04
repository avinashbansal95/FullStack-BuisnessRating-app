module.exports = {
    auth :{
        user:'avinashbansal096@gmail.com',
        pass:'your pwd'

    },
    facebook:{
        clientID     : 'your id9',
        clientSecret : 'your pwd',
        profileField :['email','displayName'],
        callbackURL  : 'http://localhost:3000/auth/facebook/callback',
        passRequestToCallback: true 
    }
}

//for retrieving first name and last name => first_name and last_name
