
exports.up = function(knex) {
  return knex.schema
    .dropTable('roster')

    .createTable('players', table => {
      table.increments('id').primary();
      table.string('first_name');
      table.string('last_name');
      table.integer('team_id').unsigned();
      table.foreign('team_id')
        .references('teams.id');
      table.timestamps(true, true);
    })
};

exports.down = function(knex) {
  return knex.schema
    .createTable('roster', table => {
      table.increments('id').primary();
      table.string('first_name');
      table.string('last_name');
      table.integer('team_id').unsigned();
      table.foreign('team_id')
        .references('teams.id');
      table.timestamps(true, true);
    });
};
