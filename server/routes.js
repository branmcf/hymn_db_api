

var routes = [
  /*
  {
    method: 'GET',
    path: '/profile',
    config: {
      auth: {
        strategies: ['simple',  'session']
      },
      handler: function (request, reply) {
        return reply.view('profile')
      }
    }
  },

  {
    method: 'GET',
    path: '/',
    config: {
      auth: {
        mode: 'try',
        strategy: 'session'
      },
      plugins: {
        'hapi-auth-cookie': {
          redirectTo: false
        }
      },
      handler: function (request, reply) {
        if (request.auth.isAuthenticated) {
          return reply.view('profile')
        }

        reply.view('index')
      }
    }
  },
  */

  {
    method: 'POST',
    path: '/',
    config: {
      // auth: 'session',
      auth: {
        mode: 'try'
      },
      handler: function (request, reply) {
        

        var username = request.payload.username
        var user = Users[ username ]

        if (!user) {
          return reply(Boom.notFound('No user registered with given credentials'))
        }

        var password = request.payload.password

        return reply.


        });
      }
    }
  },
/*
  {
    method: 'GET',
    path: '/logout',
    config: {
      auth: 'session',
      handler: function (request, reply) {
        request.cookieAuth.clear();
        reply.view('index')
      }
    }
  }
  */

]

module.exports = routes