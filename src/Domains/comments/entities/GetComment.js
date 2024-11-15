class GetComment {
  constructor (payload) {
    this._verifyPayload(payload)

    this.id = payload.id
    this.username = payload.username
    this.date = payload.date
    if (payload.is_deleted === true) {
      this.content = '**komentar telah dihapus**'
    } else {
      this.content = payload.content
    }
  }

  _verifyPayload ({ id, username, date, content }) {
    if (!id || !username || !date || !content) {
      throw new Error('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' ||
        typeof username !== 'string' ||
        typeof date !== 'string' ||
        typeof content !== 'string'
    ) {
      throw new Error('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = GetComment
