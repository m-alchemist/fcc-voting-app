const mongoose=require('mongoose');
mongoose.Promise = global.Promise;
const assert=require('assert');
const  User=require('../app/models/user');
const Poll=require('../app/models/poll');
const Option=require('../app/models/option');

describe('Associations',()=>{
  beforeEach((done)=>{
    let joe, poll, option;
    joe =new User({name: 'joe'});
    poll =new Poll({title: 'js is awesome'});
    option1= new Option({content: 'totally'});
    option2= new Option({content: 'nope'});

    joe.polls.push(poll);
    poll.options.push(option1);
    option1.user=joe;
    poll.options.push(option2);
    option2.user=joe;


    Promise.all([joe.save(),poll.save(),option1.save(),option2.save()])
    .then(()=>done());
  })

  it('save a relation between a user and blogPost', (done)=>{
    User.findOne({name:'joe'})
    .populate('polls')
    .then((user)=>{
      assert(user.polls[0].title==='js is awesome');
      done();
    })
  })
  // it('saves a full relation graph', (done)=>{
  //   User.findOne({name: 'joe'})
  //   .populate({
  //     path: 'blogPosts',
  //     populate:{
  //       path: 'comments',
  //       model:'comment',
  //       populate:{
  //         path: 'user',
  //         model: 'user'
  //       }
  //     }
  //   })
  //   .then((user)=>{
  //     assert(user.name==='joe');
  //     assert(user.blogPosts[0].title==='js is awesome');
  //     assert(user.blogPosts[0].comments[0].content==='great Post!');
  //     assert(user.blogPosts[0].comments[0].user.name==='joe');
  //
  //     done();
  //   })
  //
  // })
})
