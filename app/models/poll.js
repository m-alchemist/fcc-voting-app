const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const PollSchema=new Schema({
  title: String,
  options:[{type: Schema.Types.ObjectId,
  ref: 'option'}],
  date:{type: Date },
    user: {type: Schema.Types.ObjectId, ref: 'user'},
    userId:  String



});

const Poll=mongoose.model('poll', PollSchema);

module.exports=Poll;
