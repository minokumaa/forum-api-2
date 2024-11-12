const routes = require('./routes');
const ThreadHandler = require('./handler');

module.exports = {
  name: 'authentications',
  register: async (server, { container }) => {
    const threadHandler = new ThreadHandler(container);
    server.route(routes(threadHandler));
  },
};
