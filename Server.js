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
	res.send({
		message: "Mailer initiated it will send a confirmation mail after completing its task"
	})
	var reciverString = req.body.reciverString;
	var listofemails = reciverString.split(", ");
	var count = 0,
		attempt = 0;
	var success_email = [];
	var failure_email = [];
	var transporter;
	var subject = req.body.subject;
	var text = req.body.text;

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
		self.invokeOperation();
	};
	massMailer.prototype.invokeOperation = function () {
		var self = this;
		async.each(listofemails, self.SendEmail, function () {
			console.log(success_email);
			console.log(failure_email);
			res.send(`Success ${success_email} \n Failed ${failure_email}\n count: ${count}`);
		});
	}
	massMailer.prototype.SendEmail = function (Email, callback) {
		console.log("Sending email to " + Email);
		var self = this;
		self.status = false;
		async.waterfall([
			function (callback) {
				var mailOptions = {
					from: "Ilico Infotech Pvt. Ltd.",
					to: Email,
					subject: subject,
					text: text
				};
				transporter.sendMail(mailOptions, function (error, info) {
					attempt += 1;
					if (error) {
						console.log(error)
						failure_email.push(Email);
					} else {
						self.status = true;
						success_email.push(Email);
						count += 1;
					}
					callback(null, self.status, Email);
				});
			},
			function (statusCode, Email, callback) {
				console.log("Will update DB here for " + Email + " With " + statusCode + "count= " + count + " attempt= " + attempt);

				callback();
			}
		], function () {
			callback();
		});
	}
	new massMailer();

})
app.post('/api/testing', (req, res) => {
	var reciverString = req.body.reciverString;
	var changedString = reciverString.split(",");
	var arrays = [],
		size = 299;

	while (reciverString.length > 0)
		arrays.push(changedString.splice(0, 30));
	res.send(arrays);
})

app.listen(port, () => {
	console.log(`Server Started at ${port}`);
})