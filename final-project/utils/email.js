const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
	// Create transporter
	const transporter = nodemailer.createTransport({
		// service: 'Gmail', // has limit 5 letter, so cant test
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	});
	// Define the email options
	const mailOptions = {
		from: 'Vik <viktoryiaantonchyk@gmail.com>',
		to: options.email,
		subject: options.subject,
		text: options.message,
		// html:
	};
	// Send the email
	await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
