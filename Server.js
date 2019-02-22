/*
 * File Name : Server.js
 * Task : Run Server and fetch multiple emails from DB to send reminder
 * Invoke all the email task at once and update DB once the email is sent 
 */

/*
 * Load all the required modules 
 */
const express = require('express');
var async = require("async");
var http = require("http");
const app = express();
const port = process.env.PORT || 6342;
var nodemailer = require("nodemailer");
app.use(express.urlencoded({
	extended: true
}));

app.post('/api/mail', (req, res) => {
	var reciverString = req.body.reciverString;
	var listofemails = reciverString.split(", ");

	// This will store emails needed to send.
	// var listofemails = ["sparashar405@gmail.com", "sahnp77@gmail.com", "sa78787878787@gma.com", "shashank@ilicoinfotech.com"];
	// Will store email sent successfully.
	var success_email = [];
	// Will store email whose sending is failed. 
	var failure_email = [];

	var transporter;

	var subject = req.body.subject;
	var text = req.body.text;

	/* Loading modules done. */

	function massMailer() {
		var self = this;
		transporter = nodemailer.createTransport("SMTP", {
			host: 'mail.ilicoinfotech.com',
			port: 587,
			auth: {
				user: 'shashank@ilicoinfotech.com',
				pass: 'Ilico@2018'
			},
			tls: {
				rejectUnauthorized: false
			},
			debug: true
		});
		// Fetch all the emails from database and push it in listofemails
		self.invokeOperation();
	};

	/* Invoking email sending operation at once */

	massMailer.prototype.invokeOperation = function () {
		var self = this;
		async.each(listofemails, self.SendEmail, function () {
			console.log(success_email);
			console.log(failure_email);
			res.send(`Success ${success_email} \n Failed ${failure_email}`);
		});
	}

	/* 
	 * This function will be called by multiple instance.
	 * Each instance will contain one email ID
	 * After successfull email operation, it will be pushed in failed or success array.
	 */

	massMailer.prototype.SendEmail = function (Email, callback) {
		console.log("Sending email to " + Email);
		var self = this;
		self.status = false;
		// waterfall will go one after another
		// So first email will be sent
		// Callback will jump us to next function
		// in that we will update DB
		// Once done that instance is done.
		// Once every instance is done final callback will be called.
		async.waterfall([
			function (callback) {
				var mailOptions = {
					from: 'shashank@ilicoinfotech.com',
					to: Email,
					subject: subject,
					text: text
				};
				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log(error)
						failure_email.push(Email);
					} else {
						self.status = true;
						success_email.push(Email);
					}
					callback(null, self.status, Email);
				});
			},
			function (statusCode, Email, callback) {
				console.log("Will update DB here for " + Email + "With " + statusCode);
				callback();
			}
		], function () {
			//When everything is done return back to caller.
			callback();
		});
	}

	new massMailer(); //lets begin

})
app.post('/api/testing', (req, res) => {
	var reciverString = req.body.reciverString;
	var changedString = reciverString.split(",");
	res.send(changedString);
})

app.listen(port, () => {
	console.log(`Server Started at ${port}`);
})