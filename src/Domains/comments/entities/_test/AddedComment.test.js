const AddedComment = require('../AddedComment');

describe('addedComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {};
    
        // Action and Assert
        expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
          id: {},
          content: 123,
          owner: [],
        };
    
        // Action and Assert
        expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
    
      it('should create addedComment object correctly', () => {
        // Arrange
        const payload = {
          id: 'comment-123',
          content: 'comment',
          owner: 'user-123',
        };
    
        // Action
        const addComment = new AddedComment(payload);
    
        // Assert
        expect(addComment.id).toEqual(payload.id);
        expect(addComment.content).toEqual(payload.content);
        expect(addComment.owner).toEqual(payload.owner);
    });
});