const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const OptionSchema=new Schema({
  content: String,
  votes:Number,
  user: {type: Schema.Types.ObjectId, ref: 'user'}
});

const Option=mongoose.model('option', OptionSchema);

module.exports=Option;
