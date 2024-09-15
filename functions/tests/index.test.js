const functions = require('firebase-functions');
const admin = require('firebase-admin');
const chai = require('chai');
const expect = chai.expect;
const firebaseFunctionsTest = require('firebase-functions-test')();
const myFunctions = require('../index');