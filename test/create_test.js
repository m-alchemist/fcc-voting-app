//mocha test file

//requiring assert this value equal this value
const assert=require('assert');
const User=require('../app/models/user');

//describe function for mocha
describe('creating records', ()=>{
  //it function
  it('saves a user',(done)=>{
    const joe= new User({name: 'joe'});
    //saving joe
    //utilizing a promise
    joe.save()
    .then(()=>{
      //has joe been saved successfuly
      assert(!joe.isNew);
      done();
    })
  });
})
