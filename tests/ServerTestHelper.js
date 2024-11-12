/* istanbul ignore file */
const ServerTestHelper = {
  async getAccessToken({ server, username = 'winter' }) {
    const userPayload = {
      username, password: 'secret',
    };

    const responseUser = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        ...userPayload,
        fullname: 'fullname',
      },
    });

    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: userPayload,
    });

    const responseJsonAuth = JSON.parse(responseAuth.payload)
    const responseJsonUser = JSON.parse(responseUser.payload)
    const { id: userId } = responseJsonUser.data.addedUser;
    const { accessToken } = responseJsonAuth.data;
    return { userId, accessToken };
  },
};

module.exports = ServerTestHelper;