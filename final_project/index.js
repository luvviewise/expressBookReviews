const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
//Write the authenication mechanism here
    // Check if the session contains authorization details
    if (req.session.authorization) {
        // Retrieve the access token from the session storage
        let token = req.session.authorization.accessToken;

        
        // Verify the JWT token using the secret key (typically "access")
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                // Attach user credentials to the request object and proceed
                req.user = user;   // user = { username: "..." }
                next();
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });

    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
