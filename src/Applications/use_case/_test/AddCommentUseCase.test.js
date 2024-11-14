/* eslint-disable no-undef */
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const AddComment = require('../../../Domains/comments/entities/AddComment')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const AddCommentUseCase = require('../AddCommentUseCase')

describe('AddCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content',
      thread: 'thread-123',
      owner: 'user-123'
    }

    const mockAddedComment = new AddedComment({
      id: 'user-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner
    })

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository()
    const mockThreadRepository = new ThreadRepository()

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment))

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    })

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload)

    // Assert
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'user-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner
    }))
    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
      content: useCasePayload.content,
      thread: useCasePayload.thread,
      owner: useCasePayload.owner
    }))
  })
})
