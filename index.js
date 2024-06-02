 const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const { LogInCollection, UserDetails, RandomNumber, Merchant } = require("./mongo");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const templatePath = path.join(__dirname, '../tempelates');
const publicPath = path.join(__dirname, '../public');

app.set('view engine', 'hbs');
app.set('views', templatePath);
app.use(express.static(publicPath));

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/', (req, res) => {
    res.render('login');
});
let globalUsername = '';


app.post('/signup', async (req, res) => {
    try {
        const checking = await LogInCollection.findOne({ name: req.body.name });

        if (checking) {
            res.send("User details already exist");
        } else {
            const data = new LogInCollection({
                name: req.body.name,
                password: req.body.password
            });
            globalUsername = req.body.name;

            await data.save();
            res.redirect('/details'); // Redirect to the details page
        }
    } catch (err) {
        res.status(500).send("An error occurred: " + err.message);
    }
});
app.get('/details', async (req, res) => {
    try {
        // Check if user details already exist
        const existingDetails = await UserDetails.findOne({ name: req.body.name });

        if (existingDetails) {
            // If user details already exist, render a page with a message
            res.render('details', { message: 'User details already exist' });
        } else {
            // If user details do not exist, render a page with a different message
            res.render('details', { message: 'Enter your details' });
        }
    } catch (err) {
        res.status(500).send('An error occurred: ' + err.message);
    }
});


app.post('/details', async (req, res) => {
    try {
        const { name, firstName, lastName, dateOfBirth, aadhaarNumber, address } = req.body;

        // Check if user details already exist
        const existingDetails = await UserDetails.findOne({ name: name });
        if (existingDetails) {
            // If user details already exist, redirect to home page
            return res.redirect('/home');
        }
        
        // Append user details to UserDetails collection
        const userDetails = new UserDetails({
            name: name,
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: dateOfBirth,
            aadhaarNumber: aadhaarNumber,
            address: address
        });
        
        // Save the user details and get the saved document
        const savedUser = await userDetails.save();

        // Generate a random number
        const randomNumber = Math.floor(Math.random() * 1000000);

        // Save the random number with the userId and firstName of the saved user
        const randomNumDoc = new RandomNumber({
            userId: savedUser._id, // Store the _id of the saved user
            randomNumber: randomNumber,
            firstName: savedUser.firstName, // Store the firstName of the saved user
        });
        
        await randomNumDoc.save();

        // After saving the details and random number, redirect to home page
        res.redirect('/home');
    } catch (err) {
        res.status(500).send('An error occurred: ' + err.message);
    }
});

app.get('/home', async (req, res) => {
    try {
        // Generate a random number
        const randomNumber = Math.floor(Math.random() * 1000000);

        // Save the random number to the randomnumbers collection
        const randomNumDoc = new RandomNumber({
            randomNumber: randomNumber,
            // Use the global first name
        });
        await randomNumDoc.save();

        // Render the home page and pass the random number as a variable
        res.render('home', { randomNumber: randomNumber });
    } catch (err) {
        res.status(500).send('An error occurred: ' + err.message);
    }
});




app.post('/login', async (req, res) => {
    try {
        const check = await LogInCollection.findOne({ name: req.body.name });

        if (!check) {
            return res.status(400).send("User not found");
        }

        if (check.password === req.body.password) {
            // Check if user details already exist
            const existingDetails = await UserDetails.findOne({ name: req.body.name });
            if (existingDetails) {
                // If user details already exist, redirect to home page
                return res.redirect('/home');
            } else {
                // If user details do not exist, redirect to details page
                return res.redirect('/details');
            }
        } else {
            return res.status(400).send("Incorrect password");
        }
    } catch (e) {
        return res.status(500).send("An error occurred: " + e.message);
    }
});


app.get('/details', (req, res) => {
    res.render('details');
});

app.get('/merchant_login',(req,res)=>{
    res.render('merchant_login');
});
app.get('/merchant_signup', (req, res) => {
    res.render('merchant_signup');
});




   
    
    

app.post('/merchant_login', async (req, res) => {
    try {
        // Extract the name and password from the request body
        const { name, password } = req.body;

        // Create a new instance of Merchant model
        const merchant = new Merchant({
            name: name,
            password: password
        });

        // Save the merchant details to MongoDB
        await merchant.save();

        // Redirect the user to the home page
        res.redirect('/home');
    } catch (err) {
        // Handle any errors
        res.status(500).send('An error occurred: ' + err.message);
    }
});






app.listen(port, () => {
    console.log('Server is running on port', port);
});
