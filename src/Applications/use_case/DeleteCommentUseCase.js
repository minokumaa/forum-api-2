class DeleteCommentUseCase {
    constructor({ threadRepository, commentRepository }) {
      this._threadRepository = threadRepository;
      this._commentRepository = commentRepository;
    }
  
    async execute(useCasePayload) {
      this._validatePayload(useCasePayload);
      const { id, owner, thread } = useCasePayload;
      await this._threadRepository.verifyAvailableThread(thread)
      await this._commentRepository.verifyAvailableComment(id)
      await this._commentRepository.verifyCommentOwner(id, owner)
      return this._commentRepository.deleteComment(id)
    }
  
    _validatePayload(payload) {
      const { id, owner } = payload;
      if (!id || !owner) {
        throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
      }
  
      if (typeof id !== 'string' || typeof owner !== 'string') {
        throw new Error('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    }
  }
  
  module.exports = DeleteCommentUseCase;
  