class GetComment {
    constructor (payload) {
      this._verifyPayload(payload)
  
      this.id = payload.id
      this.username = payload.username
      this.date = payload.date
      this.content = payload.is_deleted === true ? '**komentar telah dihapus**' : payload.content
      this.is_deleted = payload.is_deleted
    }
  
    _verifyPayload ({ id, username, date, content, is_deleted }) {
      if (!id || !username || !date || !content) {
        throw new Error('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
      }
  
      if (typeof id !== 'string'
        || typeof username !== 'string'
        || typeof date !== 'string'
        || typeof content !== 'string'
        || typeof is_deleted !== 'boolean'
    ) {
        throw new Error('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
      }
    }
}
  
module.exports = GetComment