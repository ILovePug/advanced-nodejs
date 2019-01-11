
//tell jest to wait for 15 seconds for each test before failing it
jest.setTimeout(15000);
require('../models/User');

const mongoose = require('mongoose')
const keys = require('../config/keys')

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI,{useMongoClient: true})


