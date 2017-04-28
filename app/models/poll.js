const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const PollSchema=new Schema({
  title: String,
  options:[{type: Schema.Types.ObjectId,
  ref: 'option'}]


});

const Poll=mongoose.model('poll', PollSchema);

module.exports=Poll;
