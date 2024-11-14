/* eslint-disable no-undef */
const GetThread = require('../../../Domains/threads/entities/GetThread')
const GetComment = require('../../../Domains/comments/entities/GetComment')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const GetThreadUseCase = require('../GetThreadUseCase')

describe('GetThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123'
    }

    const mockGetThread = new GetThread({
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: '2024',
      username: 'winter'
    })

    const mockGetComment = new GetComment({
      id: 'comment-123',
      username: 'winter',
      date: '2024',
      content: 'content',
      is_deleted: false
    })

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockGetThread))
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockGetComment))

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    })

    // Action
    const getThread = await getThreadUseCase.execute(useCasePayload)

    // Assert
    expect(getThread).toStrictEqual(new GetThread({
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: '2024',
      username: 'winter',
      comments: [
        {
          id: 'comment-123',
          username: 'winter',
          date: '2024',
          content: 'content',
          is_deleted: false
        }
      ]
    }))
    expect(mockThreadRepository.getThreadById).toBeCalledWith(mockGetThread.id)
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(mockGetThread.id)
  })

  it('should return deleted comment', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123'
    }

    const mockGetThread = new GetThread({
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: '2024',
      username: 'winter'
    })

    const mockGetComment = new GetComment({
      id: 'comment-123',
      username: 'winter',
      date: '2024',
      content: 'content',
      is_deleted: true
    })

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockGetThread))
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockGetComment))

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    })

    // Action
    const getThread = await getThreadUseCase.execute(useCasePayload)

    // Assert
    expect(getThread).toStrictEqual(new GetThread({
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: '2024',
      username: 'winter',
      comments: [
        {
          id: 'comment-123',
          username: 'winter',
          date: '2024',
          content: '**komentar telah dihapus**',
          is_deleted: true
        }
      ]
    }))
    expect(mockThreadRepository.getThreadById).toBeCalledWith(mockGetThread.id)
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(mockGetThread.id)
  })
})
