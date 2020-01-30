
exports.up = function(knex) {
  return knex.schema
    .createTable('teams', table => {
      table.increments('id').primary();
      table.string('team_name');
      table.string('ballpark');
      table.string('website');
      table.timestamps(true, true);
    })

    .createTable('roster', table => {
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
    .dropTable('roster')
    .dropTable('papers')
};
