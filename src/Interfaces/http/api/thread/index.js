const routes = require('./routes');
const ThreadHandler = require('./handler');

module.exports = {
  name: 'thread',
  register: async (server, { container }) => {
    const threadHandler = new ThreadHandler(container);
    server.route(routes(threadHandler));
  },
};
