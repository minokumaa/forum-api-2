exports.up = pgm => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    title: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    body: {
      type: 'TEXT',
      notNull: true
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users',
      referencesConstraintName: 'fk_threads_users',
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
    date: {
      type: 'TIMESTAMP',
      default: 'NOW()'
    }
  }, {
    ifNotExists: true
  })
}

exports.down = pgm => {
  pgm.dropTable('threads', {
    ifExists: true,
    cascade: true
  })
}
