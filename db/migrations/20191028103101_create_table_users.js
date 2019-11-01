
exports.up = function(knex) {
  return knex.schema.createTable('users', usersTable => {
    usersTable.string('username', 20).primary().unique();
    usersTable.string('avatar_url').notNullable();
    usersTable.string('name').notNullable();
    usersTable.string('password').defaultTo('password');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
