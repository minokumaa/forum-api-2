const pool = require('../../database/postgres/pool')
const container = require('../../container')
const createServer = require('../createServer')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')

describe('/threads endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });
    
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable()
        await CommentsTableTestHelper.cleanTable()
    });

    describe('when POST /threads/{threadId}/comments', () => {
        it('should response 201 and persisted comment', async () => {
          // Arrange
          const server = await createServer(container);

          // user
          const { accessToken, userId } = await ServerTestHelper.getAccessToken({ server });

          // thread
          const threadId = 'thread-123';
          await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });    

          // comment
          const requestPayload = {
            content: 'content',
          };
    
          // Action
          const response = await server.inject({
            method: 'POST',
            url: `/threads/${threadId}/comments`,
            payload: requestPayload,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
          });

          await UsersTableTestHelper.findUsersById(userId)
          await ThreadsTableTestHelper.findThreadById('thread-123')
    
          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(201);
          expect(responseJson.status).toEqual('success');
          expect(responseJson.data.addedComment).toBeDefined();
        });
    
        it('should response 400 when request payload not contain needed property', async () => {
          // Arrange
          const server = await createServer(container);

          // user
          const { accessToken, userId } = await ServerTestHelper.getAccessToken({ server });

          // thread
          const threadId = 'thread-123';
          await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });    

          // comment
          const requestPayload = {};
    
          // Action
          const response = await server.inject({
            method: 'POST',
            url: `/threads/${threadId}/comments`,
            payload: requestPayload,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
          });

          await UsersTableTestHelper.findUsersById(userId)
          await ThreadsTableTestHelper.findThreadById('thread-123')

          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(400);
          expect(responseJson.status).toEqual('fail');
          expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada');
        });
    
        it('should response 400 when request payload not meet data type specification', async () => {
          // Arrange
          const server = await createServer(container);

          // user
          const { accessToken, userId } = await ServerTestHelper.getAccessToken({ server });

          // thread
          const threadId = 'thread-123';
          await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });    

          // comment
          const requestPayload = {
            content: 123,
          };
    
          // Action
          const response = await server.inject({
            method: 'POST',
            url: `/threads/${threadId}/comments`,
            payload: requestPayload,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
          });

          await UsersTableTestHelper.findUsersById(userId)
          await ThreadsTableTestHelper.findThreadById('thread-123')
    
          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(400);
          expect(responseJson.status).toEqual('fail');
          expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena tipe data tidak sesuai');
        });
    
        it('should response 401 when request doesn\'t have authentication', async () => {
          // Arrange
          const server = await createServer(container);

          // user
          const { userId } = await ServerTestHelper.getAccessToken({ server });

          // thread
          const threadId = 'thread-123';
          await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });    

          // comment
          const requestPayload = {
            content: 'content',
          };
    
          // Action
          const response = await server.inject({
            method: 'POST',
            url: `/threads/${threadId}/comments`,
            payload: requestPayload,
          });
    
          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(401);
          expect(responseJson.error).toEqual('Unauthorized');
          expect(responseJson.message).toEqual('Missing authentication');
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
        it('should response 200 and delete comment', async () => {
          // Arrange
          const server = await createServer(container);
          // user
          const { accessToken, userId } = await ServerTestHelper.getAccessToken({ server });

          //thread
          const threadId = 'thread-123'
          await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId })

          //comment
          const commentId = 'comment-123'
          await CommentsTableTestHelper.addComment({ id: commentId, owner: userId })
    
          // Action
          const response = await server.inject({
            method: 'DELETE',
            url: `/threads/${threadId}/comments/${commentId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
          });

          await UsersTableTestHelper.findUsersById(userId)
          await ThreadsTableTestHelper.findThreadById(threadId)
    
          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(200);
          expect(responseJson.status).toEqual('success');
        });
    
        it('should response 404 when deleting comment from unavailable thread', async () => {
          // Arrange
          const server = await createServer(container);
          // user
          const { accessToken } = await ServerTestHelper.getAccessToken({ server });

          //thread
          const threadId = 'thread-999'

          //comment
          const commentId = 'comment-123'
    
          // Action
          const response = await server.inject({
            method: 'DELETE',
            url: `/threads/${threadId}/comments/${commentId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
          });
    
          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(404);
          expect(responseJson.status).toEqual('fail');
        });

        it('should response 404 when deleting comment from unavailable comment', async () => {
          // Arrange
          const server = await createServer(container);
          // user
          const { accessToken } = await ServerTestHelper.getAccessToken({ server });

          //thread
          const threadId = 'thread-123'

          //comment
          const commentId = 'comment-999'
    
          // Action
          const response = await server.inject({
            method: 'DELETE',
            url: `/threads/${threadId}/comments/${commentId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
          });
    
          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(404);
          expect(responseJson.status).toEqual('fail');
        });
    });
});