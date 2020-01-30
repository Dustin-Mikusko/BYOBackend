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
    console.log(team);
    const teamId = team[0].id;
    console.log(teamId);

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
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});

