var nodemailer = require('nodemailer');
var mailconfig = require('./../config/mailingUtils');


var transporter = nodemailer.createTransport(mailconfig.serverdetails);

module.exports.transport = transporter;