const GetComment = require('../../Domains/comments/entities/GetComment')

class GetThreadUseCase {
  constructor ({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
  }

  async execute (useCasePayload) {
    await this._threadRepository.verifyAvailableThread(useCasePayload.id)
    const thread = await this._threadRepository.getThreadById(useCasePayload.id)
    const comments = await this._commentRepository.getCommentsByThreadId(useCasePayload.id)

    if (comments.length > 0) {
      thread.comments = comments.map((comment) => new GetComment(comment))
    }
    return thread
  }
}

module.exports = GetThreadUseCase
