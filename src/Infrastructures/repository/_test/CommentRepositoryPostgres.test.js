const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const GetThread = require('../../../Domains/threads/entities/GetThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddComment = require('../../../Domains/comments/entities/AddComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const GetComment = require('../../../Domains/comments/entities/GetComment');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable()
    await CommentTableTestHelper.cleanTable()
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment correctly', async () => {
        // Arrange
        const fakeIdGenerator = () => '123'; // stub!

        // User
        const registerUser = new RegisterUser({
            username: 'dicoding',
            password: 'secret_password',
            fullname: 'Dicoding Indonesia',
        });
        const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
        const registeredUser = await userRepositoryPostgres.addUser(registerUser);
        
        // Thread
        const registerThread = new AddThread({
            title: 'title',
            body: 'body',
            owner: registeredUser.id
        })
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
        const registeredThread = await threadRepositoryPostgres.addThread(registerThread)
        
        // Comment
        const registerComment = new AddComment({
            content: 'content',
            thread: registeredThread.id,
            owner: registeredUser.id
        })
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
        
        // Action
        const registeredComment = await commentRepositoryPostgres.addComment(registerComment)

        // Assert
        const commentHelper = await CommentTableTestHelper.findCommentById(registeredComment.id);
        expect(commentHelper).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
        // Arrange
        const fakeIdGenerator = () => '123'; // stub!

        // User
        const registerUser = new RegisterUser({
            username: 'dicoding',
            password: 'secret_password',
            fullname: 'Dicoding Indonesia',
        });
        const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
        const registeredUser = await userRepositoryPostgres.addUser(registerUser);
        
        // Thread
        const registerThread = new AddThread({
            title: 'title',
            body: 'body',
            owner: registeredUser.id
        })
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
        const registeredThread = await threadRepositoryPostgres.addThread(registerThread)
        
        // Comment
        const registerComment = new AddComment({
            content: 'content',
            thread: registeredThread.id,
            owner: registeredUser.id
        })
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
        
        // Action
        const registeredComment = await commentRepositoryPostgres.addComment(registerComment)
  
        // Assert
        expect(registeredComment).toStrictEqual(new AddedComment({
          id: 'comment-123',
          content: registeredComment.content,
          owner: registeredUser.id,
        }));
    });
  });

  describe('verifyAvailableComment function', () => {
    it('should not throw error when comment is available', async () => {
      // Arrange
      await CommentTableTestHelper.addComment({ id: 'comment-123', thread: 'thread-123', owner: 'user-123' })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      
      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment('comment-123')).resolves.not.toThrowError(NotFoundError);
    });

    it('should throw NotFoundError when comment is not available', async () => {
       // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment('comment-123')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should not throw error when comment is yours', async () => {
        // Arrange
        await CommentTableTestHelper.addComment({ id: 'comment-123', thread: 'thread-123', owner: 'user-123' })
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        
        // Action & Assert
        await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
    });

    it('should throw AuthorizationError when comment is not yours', async () => {
       // Arrange
       const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('thread-123', 'user-999')).rejects.toThrowError(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should not throw error when comment is available', async () => {
      // Arrange
      const commentId = 'comment-123'
      const threadId = 'thread-123'
      await CommentTableTestHelper.addComment({ id: commentId, thread: threadId })

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      
      await commentRepositoryPostgres.deleteComment(commentId)
      const comment = await commentRepositoryPostgres.findCommentById(commentId)
      // Action & Assert
      expect(comment.is_deleted).toEqual(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comment correctly', async () => {
      // Arrange

      // User
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'winter'})

      // Thread
      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' })

      // Comment
      const comment = {
        id: 'comment-123',
        content: 'content',
        thread: 'thread-123',
        owner: 'user-123'
      }
      await CommentTableTestHelper.addComment(comment)
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const getComment = await commentRepositoryPostgres.getCommentsByThreadId('comment-123')

      // Assert
      expect(getComment).toStrictEqual(new GetComment({
        id: comment.id,
        content: comment.content,
        owner: comment.owner,
        username: 'winter',
        date: getComment.date
      }))
    });

    it('should throw NotFoundError when comment is not found', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

        // Action & Assert
        await expect(commentRepositoryPostgres.getCommentsByThreadId('thread-123')).rejects.toThrowError(NotFoundError);
      });
  });
});
