/* eslint-disable no-undef */
const AddThread = require('../AddThread')

describe('addThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {}

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: [],
      owner: {}
    }

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create addThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'title',
      body: 'body',
      owner: 'user-123'
    }

    // Action
    const addThread = new AddThread(payload)

    // Assert
    expect(addThread.id).toEqual(payload.id)
    expect(addThread.title).toEqual(payload.title)
    expect(addThread.owner).toEqual(payload.owner)
  })
})
