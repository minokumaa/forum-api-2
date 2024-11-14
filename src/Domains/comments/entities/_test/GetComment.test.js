/* eslint-disable no-undef */
const GetComment = require('../GetComment')

describe('GetComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {}

    // Action and Assert
    expect(() => new GetComment(payload)).toThrowError('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 999,
      username: [],
      date: 123,
      content: 456,
      is_deleted: 123
    }

    // Action and Assert
    expect(() => new GetComment(payload)).toThrowError('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create getComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'winter',
      date: '2024',
      content: 'content',
      is_deleted: false
    }

    // Action
    const getComment = new GetComment(payload)

    // Assert
    expect(getComment.id).toEqual(payload.id)
    expect(getComment.username).toEqual(payload.username)
    expect(getComment.date).toEqual(payload.date)
    expect(getComment.content).toEqual(payload.content)
  })
})
