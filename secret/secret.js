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
    },
    google:{
        clientID : '545686626310-2gudmci9f264m195aoq85p05lujkms68.apps.googleusercontent.com',
        clientSecret: '0QyKL9AOOJAWt2SXobnK1klX',
        callbackURL  : 'http://localhost:3000/auth/google/callback',
        passRequestToCallback: true 
    },
    linkedin:{
        clientID : '81bi15gz90nvit',
        clientSecret: 'ughSQ4IhUXT4lePS',
       
        callbackURL  : 'http://localhost:3000/auth/github/callback',
        passRequestToCallback: true 
    },
    github:{
        clientID : 'bafe53eb08cc99771319',
        clientSecret: 'bec411ba5c8471f634937deeb23b079695ce46ca',
        //scope: ['r_emailaddress', 'r_basicprofile'],
        callbackURL  : 'http://localhost:3000/auth/github/callback',
        passRequestToCallback: true 
    }
}

//for retrieving first name and last name => first_name and last_name
