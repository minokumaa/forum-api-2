class GetThreadUseCase {
  constructor ({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
  }

  async execute (useCasePayload) {
    await this._threadRepository.verifyAvailableThread(useCasePayload.threadId)
    const thread = await this._threadRepository.getThreadById(useCasePayload.threadId)
    const comments = await this._commentRepository.getCommentsByThreadId(useCasePayload.threadId)

    thread.comments = comments.map((comment) => {
        if (comment.is_deleted === true) {
          comment.content = '**komentar telah dihapus**'
        }
        return {
          id: comment.id,
          username: comment.username,
          date: comment.date,
          content: comment.content
        }
    })
  
    return thread
  }
}

module.exports = GetThreadUseCase
