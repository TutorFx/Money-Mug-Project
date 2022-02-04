const mongoose = require('mongoose');

// Conecta no MongoDB
mongoose.connect( "mongodb://localhost:27017/User");
mongoose.Promise = global.Promise;

module.exports = mongoose;