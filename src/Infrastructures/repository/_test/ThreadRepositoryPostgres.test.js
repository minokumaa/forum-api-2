/* eslint-disable no-undef */
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const AddThread = require('../../../Domains/threads/entities/AddThread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const RegisterUser = require('../../../Domains/users/entities/RegisterUser')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const UserRepositoryPostgres = require('../UserRepositoryPostgres')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addThread function', () => {
    it('should persist add thread correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub!

      // User
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia'
      })
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)
      const registeredUser = await userRepositoryPostgres.addUser(registerUser)

      // Thread
      const registerThread = new AddThread({
        title: 'title',
        body: 'body',
        owner: registeredUser.id
      })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const registeredThread = await threadRepositoryPostgres.addThread(registerThread)

      // Assert
      const threadHelper = await ThreadTableTestHelper.findThreadById(registeredThread.id)
      expect(threadHelper).toHaveLength(1)
    })

    it('should return added thread correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub!

      // User
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia'
      })
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)
      const registeredUser = await userRepositoryPostgres.addUser(registerUser)

      // Thread
      const registerThread = new AddThread({
        title: 'title',
        body: 'body',
        owner: registeredUser.id
      })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const registeredThread = await threadRepositoryPostgres.addThread(registerThread)

      // Assert
      expect(registeredThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: registerThread.title,
        owner: registeredUser.id
      }))
    })
  })

  describe('verifyAvailableThread function', () => {
    it('should not throw error when thread is available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).resolves.not.toThrowError(NotFoundError)
    })

    it('should throw NotFoundError when thread is not available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).rejects.toThrowError(NotFoundError)
    })
  })

  describe('getThreadById function', () => {
    it('should return thread correctly', async () => {
      // Arrange

      // User
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'winter' })

      // Thread
      const thread = {
        id: 'thread-123',
        title: 'title',
        body: 'body',
        owner: 'user-123',
        username: 'winter'
      }
      await ThreadTableTestHelper.addThread(thread)
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})
      const getThread = await threadRepositoryPostgres.getThreadById('thread-123')

      // Action & Assert
      expect(getThread.id).toEqual(thread.id)
      expect(getThread.title).toEqual(thread.title)
      expect(getThread.body).toEqual(thread.body)
      expect(getThread.username).toEqual(thread.username)
      expect(getThread).toHaveProperty('date')
    })
  })
})
