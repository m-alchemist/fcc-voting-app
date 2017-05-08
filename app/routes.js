module.exports = function(app, passport) {
	const mongoose=require('mongoose');
	mongoose.Promise = global.Promise;
	const  User=require('../app/models/user');
	const Poll=require('../app/models/poll');
	const Option=require('../app/models/option');
	const async=require('async');
	//creating test subject

	var testPoll;
	var currentUser;
	var owner=false;





	// route for home page
	app.get('/', function(req, res) {

		res.render('index.ejs',{user: req.user});
		// res.sendFile(__dirname+'index.html'); // load the index.ejs file
	});

	// route for login form
	// route for processing the login form
	// route for signup form
	// route for processing the signup form

	// route for showing the profile page
	app.get('/profile', isLoggedIn, function(req, res) {
		var currentUser=req.user;
		User.findById(req.user._id)
		.populate('polls')
		.populate('options')
		.then((user)=>{
			// res.send(user);
			res.render('profile.ejs', {
				user: user,
				Poll:user.polls})

			});
		})

		app.get('/currentPoll/:pollId(*)', function(req, res, next){

			// res.send(poll);

			currentPoll= Poll.findById(req.params.pollId)
			.populate('options')
				.populate('user')
			.then((poll)=>{

					if(req.user){
						if(poll.userId==req.user._id)
					owner=true;
					else
						owner=false

				}

					// res.send(poll.userId +'#####'+req.user._id +"#####"+owner);
				res.render('currentPoll.ejs', {
					user : req.user,
					owner:owner,
					clickHandler: 'func1();',
					Poll: poll});
				})



			})

			app.get('/newOption/:pollExtraOption(*)', function(req, res, next){
				// res.send('option:'+req.query.id + ' id:'+req.query.ExtraOption);
				if(req.query.ExtraOption){
				var NewOption= new Option({content: req.query.ExtraOption});
				Poll.findById(req.query.id)
				.populate('options')
				.then((poll)=>{
					poll.options.push(NewOption);
					Promise.all([poll.save(),NewOption.save()])
					.then(()=>Poll.findById(req.query.id).populate('options'))

					.then((poll)=>{
						if(req.user)
						if(poll.userId==req.user._id)
						owner=true;

						res.render('currentPoll.ejs', {
							user : req.user,
							owner:owner,
							clickHandler: 'func1();',
							Poll: poll});

						})

					})
				}
				else{
					Poll.findById(req.query.id).populate('options')

					.then((poll)=>{
						if(req.user)
						if(poll.userId==req.user._id)
						owner=true;

						res.render('currentPoll.ejs', {
							user : req.user,
							owner:owner,
							clickHandler: 'func1();',
							Poll: poll});

						})



				}




				});





				app.get('/updateVote/:optionId/:pollId', function(req, res, next){
					// // res.send(req.params.optionId);
					// res.send(req.params.optionId +' /n' +req.params.pollId);
					Option.findByIdAndUpdate(req.params.optionId,{$inc: {votes:1}})
					.then((option)=>{
						option.save();

					})

					.then(()=>Poll.findById(req.params.pollId).populate('options'))

					.then((poll)=>{
						if(req.user)
						if(poll.userId==req.user._id)
						owner=true;



						res.render('currentPoll.ejs', {
							user : req.user,
							owner:owner,
							clickHandler: 'func1();',
							Poll: poll});

						})
					})

					app.get('/newPoll', function(req, res, next){

						res.render('newPoll.ejs',{
								user : req.user
						});
					})

					app.get('/pollCreation/:newPoll(*)', function(req, res, next){
						if(req.query.Title && req.query.Options){
						let newPoll;
						newPoll=new Poll({title: req.query.Title, date: Date.now(), userId: req.user._id});
						var optionArray=req.query.Options.split(',');


						// 				optionArray.forEach(function(doc) {
						//
						// })
						function asyncFunction (item, cb) {
							setTimeout(() => {
								var tempDoc=new Option({content: item});
								newPoll.options.push(tempDoc);
								Promise.all([newPoll.save(),tempDoc.save()]);
								cb();
							}, 100);
						}
						let requests = optionArray.map((item) =>{

							return new Promise((resolve) => {
								asyncFunction(item, resolve);
							});
						})

						Promise.all(requests)
						.then(()=>User.findById(req.user._id))
						.then((user)=>{
							user.polls.push(newPoll);
							user.save();
						})
						.then(()=>Poll.findById(newPoll._id).populate('options'))

						.then((poll)=>{
							if(req.user)
							if(poll.userId==req.user._id)
							owner=true;

							res.render('currentPoll.ejs', {
								user : req.user,
								owner:owner,
								clickHandler: 'func1();',
								Poll: poll});

							})



							}
							else{
								res.render('newPoll.ejs',{
										user : req.user
								});

							}
						})








						// route for logging out
						app.get('/logout', function(req, res) {
							req.logout();
							res.redirect('/');
						});

						app.get('/latestPolls', function(req, res) {
							Poll.find().populate('options').sort({date: -1})
							.then((polls)=>{

								res.render('latestPolls.ejs', {
									// get the user out of session and pass to template
									user : req.user,
									Poll: polls

								});
							})

						});
						app.get('/delete/:id',function(req,res){
							Poll.findByIdAndRemove(req.params.id)
							.then(()=>{
								User.findById(req.user._id)
								.populate('polls')
								.then((user)=>{
									// res.send(user);
									res.render('profile.ejs', {
										user: user,
										Poll:(user.polls).sort({date: -1})})

									});

							})


						})
						// facebook routes

						// =====================================
						// TWITTER ROUTES =====================
						// =====================================
						// route for twitter authentication and login
						app.get('/auth/twitter', passport.authenticate('twitter'));

						// handle the callback after twitter has authenticated the user
						app.get('/auth/twitter/callback',
						passport.authenticate('twitter', {
							// successRedirect : '/profile',

							successRedirect : '/profile',
							failureRedirect : '/'
						}));

					};

					// route middleware to make sure a user is logged in
					function isLoggedIn(req, res, next) {

						// if user is authenticated in the session, carry on
						if (req.isAuthenticated())
						return next();

						// if they aren't redirect them to the home page
						res.redirect('/');
					}
