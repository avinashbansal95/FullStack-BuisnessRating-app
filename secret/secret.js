module.exports = {
    auth :{
        user:'avinashbansal096@gmail.com',
        pass:'bansal@123'

    },
    facebook:{
        clientID     : '506728536407649',
        clientSecret : 'ec972cf9cc2046a4803283af4f77790d',
        profileField :['email','displayName'],
        callbackURL  : 'http://localhost:3000/auth/facebook/callback',
        passRequestToCallback: true 
    }
}

//for retrieving first name and last name => first_name and last_name