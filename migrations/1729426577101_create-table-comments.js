exports.up = pgm => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      notNull: true,
      primaryKey: true
    },
    content: {
      type: 'TEXT',
      notNull: true
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users',
      referencesConstraintName: 'fk_comments_users',
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
    thread: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'threads',
      referencesConstraintName: 'fk_comments_threads',
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
    is_deleted: {
      type: 'BOOLEAN',
      default: 'FALSE'
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
  pgm.dropTable('comments', {
    ifExists: true,
    cascade: true
  })
}
