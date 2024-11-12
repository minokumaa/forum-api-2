const AddComment = require('../AddComment');

describe('addComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {};
    
        // Action and Assert
        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
          content: 123,
          owner: [],
          thread: {},
        };
    
        // Action and Assert
        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
    
      it('should create addComment object correctly', () => {
        // Arrange
        const payload = {
          content: 'comment',
          owner: 'user-123',
          thread: 'thread-123',
        };
    
        // Action
        const addComment = new AddComment(payload);
    
        // Assert
        expect(addComment.content).toEqual(payload.content);
        expect(addComment.owner).toEqual(payload.owner);
        expect(addComment.thread).toEqual(payload.thread);
    });
});