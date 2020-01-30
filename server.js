const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3001);
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

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});

