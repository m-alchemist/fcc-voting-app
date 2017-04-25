'use strict';

const Hapi = require('hapi');
const Boom = require('boom');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
  port: 3000
});

// Register bell and hapi-auth-cookie with the server
server.register([require('hapi-auth-cookie'), require('bell')], function(err) {

  //Setup the session strategy
  server.auth.strategy('session', 'cookie', {
    password: 'babablacksheep123456789babablacksheep123456789', //Use something more secure in production
    redirectTo: '/auth/twitter', //If there is no session, redirect here
    isSecure: false //Should be set to true (which is the default) in production
  });

  //Setup the social Twitter login strategy
  server.auth.strategy('twitter', 'bell', {
    provider: 'twitter',
    password: 'babablacksheep123456789babablacksheep123456789', //Use something more secure in production
    clientId: 'unjlXpB0w32UNwQW7XRA43cW3',
    clientSecret: 'OjCqm9GSl83hMzlJLuVBtW5YIDFwpucXe1xgApaSz73pdNPZGz',
    isSecure: false //Should be set to true (which is the default) in production
  });

  //Setup the routes (this could be done in an own file but for the sake of simplicity isn't)
  server.route({
    method: 'GET',
    path: '/auth/twitter',
    config: {
      auth: 'twitter', //<-- use our twitter strategy and let bell take over
      handler: function(request, reply) {

        if (!request.auth.isAuthenticated) {
          return reply(Boom.unauthorized('Authentication failed: ' + request.auth.error.message));
        }

        //Just store a part of the twitter profile information in the session as an example. You could do something
        //more useful here - like loading or setting up an account (social signup).
        const profile = request.auth.credentials.profile;

        request.cookieAuth.set({
          twitterId: profile.id,
          username: profile.username,
          displayName: profile.displayName
        });

        return reply.redirect('/');
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/',
    config: {
      auth: 'session', //<-- require a session for this, so we have access to the twitter profile
      handler: function(request, reply) {

        //Return a message using the information from the session
        return reply('Hello, ' + request.auth.credentials.displayName + '!');
      }
    }
  });

  // Start the server
  server.start((err) => {

    if (err) {
      throw err;
    }

    console.log('Server running at:', server.info.uri);
  });
});
