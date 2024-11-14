/* eslint-disable no-undef */
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const AddThread = require('../../../Domains/threads/entities/AddThread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddThreadUseCase = require('../AddThreadUseCase')

describe('AddThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'title',
      body: 'body',
      owner: 'user-123'
    }

    const mockAddedThread = new AddedThread({
      id: 'user-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner
    })

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread))

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository
    })

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload)

    // Assert
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'user-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner
    }))
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner
    }))
  })
})
