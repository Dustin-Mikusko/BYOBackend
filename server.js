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
  } catch(err) {
    res.status(500).json({ err });
  };
});

app.get('/api/v1/teams/:id', async (req, res) => {
  const { id } = req.params;
  const teams = await database('teams').select();
  const team = teams.find(team => team.id === Number(id));
  
  if (!team) {
    return res.status(404).json('No team found.')
  }

  res.status(200).json({
    id: team.id,
    team_name: team.team_name,
    ballpark: team.ballpark,
    website: team.website
  });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});

