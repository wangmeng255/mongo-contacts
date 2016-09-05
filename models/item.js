var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phoneNumber: Array,
    Address: Array
});

var Item = mongoose.model('Item', ItemSchema);

module.exports = Item;