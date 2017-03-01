const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');

// Hooking app onto the server
const app = express();

// Simple Middleware example
// const logger = (req, res, next) => {
// 	console.log('logging...');
// 	next();
// };

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Middleware for static resources
app.use(express.static(path.join(__dirname, 'public')));

// Global variables
app.use((req, res, next) => {
	res.locals.errors = null;
	next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

const users = [
	{
		id: 1,
		first_name: 'John',
		last_name: 'Doe',
		email: 'jod@gmail.com',
	},
	{
		id: 2,
		first_name: 'Jade',
		last_name: 'Doe',
		email: 'jad@gmail.com',
	}
];

// Get for Home Page
app.get('/', (req, res) => {
	res.render('index', {
		title: 'Customers',
		users: users,
	});
});

// Adding user
app.post('/users/add', (req, res) => {

	req.checkBody('first_name', 'First Name requried').notEmpty();
	req.checkBody('last_name', 'Last Name requried').notEmpty();
	req.checkBody('email', 'Email requried').notEmpty();

	const errors = req.validationErrors();

	// Check for errors
	if (errors) {
		res.render('index', {
			title: 'Customers',
			users: users,
			errors: errors
		});
	} else {	
		const newUser = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
		};
		console.log('Success');
	}

});

// Start server
app.listen(3000, () => {
	console.log('Server started on port 3000');
});
