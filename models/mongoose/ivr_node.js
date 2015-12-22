var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IvrNodeSchema = new Schema({},{ "strict": false });

mongoose.model('IvrNode', IvrNodeSchema);