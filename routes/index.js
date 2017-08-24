var express = require('express');
var app = express.Router();
var mongodb = require('mongodb');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
const saltRounds = bcrypt.genSaltSync(10);








module.exports = app;
