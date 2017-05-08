const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const OptionSchema=new Schema({
  content: String,
  votes:{type:Number, default: 0},
  user: {type: Schema.Types.ObjectId, ref: 'user'}
});

const Option=mongoose.model('option', OptionSchema);

module.exports=Option;
