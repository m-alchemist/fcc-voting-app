


const mongoose=require('mongoose');

mongoose.Promise = global.Promise;

//connection logic
before( (done) => {
  mongoose.connect('mongodb://localhost:user_test');

  mongoose.connection
  .once('open',()=>{done()})
  .on('error',(err)=>{
    console.warn('Warning',err);

  });


});
//
//
// //creating a hook
// //utilizing done function which pauses everything else
// beforeEach((done)=>{
//   const {users,options,polls}=mongoose.connection.collections;
//   users.drop(()=>{
//     options.drop(()=>{
//       polls.drop(()=>{
//         done();
//       })
//     })
//
//   })
// })
