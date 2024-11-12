const GetThread = require('../GetThread');

describe('getThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {};
    
        // Action and Assert
        expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
          id: 123,
          title: 456,
          body: 789,
          date: 2233,
          username: true
        };
    
        // Action and Assert
        expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
    
      it('should create getThread object correctly', () => {
        // Arrange
        const payload = {
          id: 'thread-123',
          title: 'title',
          body: 'body',
          date: '2024',
          username: 'winter'
        };
    
        // Action
        const getThread = new GetThread(payload);
    
        // Assert
        expect(getThread.id).toEqual(payload.id);
        expect(getThread.title).toEqual(payload.title);
        expect(getThread.body).toEqual(payload.body);
        expect(getThread.date).toEqual(payload.date);
        expect(getThread.username).toEqual(payload.username);
    });
});