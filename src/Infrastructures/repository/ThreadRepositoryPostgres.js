const ThreadRepository = require('../../Domains/threads/ThreadRepository')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AddedThread = require('../../Domains/threads/entities/AddedThread')
const GetThread = require('../../Domains/threads/entities/GetThread')

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addThread (thread) {
    const { title, body, owner } = thread
    const id = `thread-${this._idGenerator()}`

    const query = {
      text: 'INSERT INTO threads VALUES ($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, owner]
    }
    const result = await this._pool.query(query)
    return new AddedThread(result.rows[0])
  }

  async verifyAvailableThread (threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId]
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Thread not found')
    }
  }

  async getThreadById (threadId) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date::text, users.username 
                FROM threads 
                LEFT JOIN users ON users.id=threads.owner
                WHERE threads.id = $1`,
      values: [threadId]
    }
    const result = await this._pool.query(query)
    return new GetThread({ ...result.rows[0] })
  }
}

module.exports = ThreadRepositoryPostgres
