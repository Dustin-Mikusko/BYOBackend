const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);
app.locals.title = 'BYOBackend';
app.use(express.json());

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.get('/api/v1/teams', async (req, res) => {
  try {
    const teams = await database('teams').select();
    const displayTeams = teams.map(team => {
      return  {
        id: team.id,
        team_name: team.team_name,
        ballpark: team.ballpark,
        website: team.website
      }
    })
    res.status(200).json({ teams: displayTeams });
  } catch(error) {
    res.status(500).json({ error: 'Internal server error' });
  };
});

app.get('/api/v1/teams/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const teams = await database('teams').select();
    const team = teams.find(team => team.id === Number(id));
  
    if (!team) {
      return res.status(404).json(`No team found with id ${id}`)
    }

    res.status(200).json({
      id: team.id,
      team_name: team.team_name,
      ballpark: team.ballpark,
      website: team.website
    });
  } catch(error) {
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/v1/teams/:id/roster', async (req, res) => {
  try {
    const { id } = req.params;
    const team = await database('teams').where('id', id).select();
    const teamId = team[0].id;

    if (!teamId) {
      return res.status(404).json(`No team found with id ${id}`)
    } else {
      const roster = await database('roster').where('team_id', Number(teamId)).select();
      const displayRoster = roster.map(player => {
      return {
        id: player.id,
        first_name: player.first_name,
        last_name: player.last_name,
      }
    })
      res.status(200).json({ roster: displayRoster });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/v1/players', async (req, res) => {
  try {
    const players = await database('roster').select();
    const displayPlayers = players.map(player => {
      return {
        id: player.id,
        first_name: player.first_name,
        last_name: player.last_name,
      }
    })

    res.status(200).json({
      players: displayPlayers
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
});

app.post('/api/v1/teams', async (req, res) => {
  const team = req.body;

  for (let requiredParameter of ['team_name', 'ballpark', 'website']) {
    if (!team[requiredParameter]) {
      return res.status(422).send({ error: `Expected format: { team_name: <String>, ballpark: <String>, website: <String> }. You're missing a '${requiredParameter}' property.` });
    }
  }

  try {
    const { team_name, ballpark, website } = team;
    const id = await database('teams').insert(team, 'id');
    res.status(201).json({
      id: id[0],
      team_name,
      ballpark,
      website
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' })
  }
});

app.post('/api/v1/teams/:id/roster', async (req, res) => {
  const body = req.body;
  const { id } = req.params;
  const player = {...body, team_id: Number(id)};

  for (let requiredParameter of ['first_name', 'last_name']) {
    if (!player[requiredParameter]) {
      return res.status(422).send({ error: `Expected format: { first_name: <String>, last_name: <String> }. You're missing a '${requiredParameter}' property.` });
    }
  }

  try {
    const { first_name, last_name } = player;
    const id = await database('roster').insert(player, 'id');
    res.status(201).json({
      id: id[0],
      first_name,
      last_name,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.delete('/api/v1/players/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await database('roster').where('id', id).del();
    res.sendStatus(204)
  } catch (error) {
    res.status(500).send({ error: 'Internal server error.' })
  }
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});

