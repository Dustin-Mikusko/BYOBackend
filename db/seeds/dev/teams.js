const teams = require('../../../teams');

const createTeam = async (knex, team) => {
  const { teamName, ballPark, website, roster } = team
  const teamId = await knex('teams').insert({
    team_name: teamName,
    ballpark: ballPark,
    website: website
  }, 'id');

  let rosterPromises = roster.map(player => {
    return createRoster(knex, {
      first_name: player.firstName,
      last_name: player.lastName,
      team_id: teamId[0]
    })
  });

  return Promise.all(rosterPromises);
};

const createRoster = (knex, roster) => {
  return knex('roster').insert(roster)
};

exports.seed = async knex => {
  try {
    await knex('roster').del();
    await knex('teams').del();

    let teamPromises = teams.map(team => {
      return createTeam(knex, team);
    });

    return Promise.all(teamPromises);
  } catch (error) {
    console.log(`Error seeding data: ${error}`)
  }
};
