const express = require('express');   //this sets the variable express to require the express package to use throughout
const app = express();    //this sets the variable app to use the method express so that all the inherent methods with express work
const cors = require('cors');   //this sets the variable cors to require the cors package which allows requests to be made from another domain

app.set('port', process.env.PORT || 3000);    //this looks to see which environment port is being used, and if there is none, defaults to use 3000
app.locals.title = 'BYOBackend';    //this sets a title property on the app.locals object to 'BYOBackend', so the app has a title
app.use(express.json());    //this tells the app to use the json() method on express, which defaults to json the information from the request body
app.use(cors());    //this tells the app to use the cors methods to activate the cors package to allows cross origin requests

const environment = process.env.NODE_ENV || 'development';    //this checks to see which enviroment is being used, and if there is no assigned envrionment (heroku uses the production envrionment), then default to the development environment
const configuration = require('./knexfile')[environment];   //this sets the configuration variable to look into the knexfile.js and get the correct enrionment object
const database = require('knex')(configuration);    //this sets the database variable to look into the correct config to work with the correct version of the database throughout

app.get('/api/v1/teams', async (req, res) => {    //this sets a GET request endpoint to '/api/v1/teams' and delcares the function to be async
  try {                                           //opens up a try block to use async methods
    const teams = await database('teams').select();   //sets a variable teams to gathers the table named 'teams' from the database
    const displayTeams = teams.map(team => {    //sets a variable named displayTeams to map through the teams retreived from the database
      return  {                                 //returns an object from each team row retrieved from the database
        id: team.id,
        team_name: team.team_name,
        ballpark: team.ballpark,
        website: team.website
      }
    })
    res.status(200).json({ teams: displayTeams });    //upon successful retrieval of the data, sends a status code of 200 OK and jsons an object with a property of teams which has a value of the display teams variable (an array of team objects) to send in the response body
  } catch(error) {    //opens up the catch block to handle errors
    res.status(500).json({ error: 'Internal server error' });   //upon any server error, sends a status code of 500 and jsons an object with error property and value of an error message in the response body
  };
});

app.get('/api/v1/teams/:id', async (req, res) => {    //this sets a GET request endpoint to '/api/v1/teams/:id' to search for a specific team by id and delcares the function to be async
  try {                                               //opens up a try block to use async methods
    const { id } = req.params;                        //pulls the id property off of the request parameters object
    const teams = await database('teams').select();   //sets a variable teams to gathers the table named 'teams' from the database
    const team = teams.find(team => team.id === Number(id));    //sets a variable team to find the team with the matching id as the reqest params id
  
    if (!team) {
      return res.status(404).json(`No team found with id ${id}`)    //if the id in the url endpoint is not found, returns a status code of 404 telling the user that there is no team with that id
    }

    res.status(200).json({    //if there IS a team with an id that matches the url id, returns a status code of 200 OK and sends a json object with the team info in the response body
      id: team.id,
      team_name: team.team_name,
      ballpark: team.ballpark,
      website: team.website
    });
  } catch(error) {    //opens up a catch block to handle server errors
      res.status(500).json({ error: 'Internal server error' });   //upon any server error, sends a status code of 500 and jsons an object with error property and value of an error message in the response body
  }
});

app.get('/api/v1/teams/:id/roster', async (req, res) => {   //this sets a GET request endpoint to '/api/v1/teams/:id/roster' to search for a specific team by id and return its current roster and delcares the function to be async
  try {   //opens a try block
    const { id } = req.params;    //grabs the id property off of the request parameters object 
    const team = await database('teams').where('id', id).select();    //searched the data and finds the team where the team id matches the request id
    const teamId = team[0].id;    //the previous line returns an array with one team id number, so this returns the one and only element in the array

    if (!teamId) {           //if there is no team id that matches the url id, sends a status code 404 not found and a json object in the response body
      return res.status(404).json(`No team found with id ${id}`)
    } else {
      const roster = await database('players').where('team_id', Number(teamId)).select();   //otherwise create a variable roster and search the players database for every player that has a team_id tag that matches the teamId
      const displayRoster = roster.map(player => {    //create a displayRoster varibale that returns an array of player objects with important information
      return {
        id: player.id,
        first_name: player.first_name,
        last_name: player.last_name,
      }
    })
      res.status(200).json({ roster: displayRoster });    //send a status code of 200 OK and a json object with a roster property and value of an array of player objects in the response body
    }
  } catch (error) {   //catch block to handle any server errors and send a status code of 500 and error object with error message in response object
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/v1/players', async (req, res) => {    //this sets a GET endpoint of /api/v1/players to retrieve all players from the players table
  try {   //opens a try block for async methods
    const players = await database('players').select();   //sets a variables of players to retreiving the players from the players table
    const displayPlayers = players.map(player => {    //sets a displayPlayers variable to map through the players array and create player objects with id, first_name and last_name
      return {
        id: player.id,
        first_name: player.first_name,
        last_name: player.last_name,
      }
    })

    res.status(200).json({    //returns a status code of 200 OK and jsons an object with players property and value of an array of player objects
      players: displayPlayers
    })
  } catch (error) {   //catch block for handling any server errors
    res.status(500).json({ error: 'Internal server error' })    //sends a status code of 500 with an error object and error message
  }
});

app.post('/api/v1/teams', async (req, res) => {   //sets a POST endpoint at /api/v1/teams to post a new team object to the teams table
  const team = req.body;    //grabs the team property off of the request body object

  for (let requiredParameter of ['team_name', 'ballpark', 'website']) {   //sets a for loop to check through and array of requiredProperties on the request body to ensure the request body will correctly match the table data structure
    if (!team[requiredParameter]) {   //if the request body is missing a required parameter, returns a status code of 422 unproccesbable entity and an error object with an error message detailing what is expected in the request body
      return res.status(422).send({ error: `Expected format: { team_name: <String>, ballpark: <String>, website: <String> }. You're missing a '${requiredParameter}' property.` });
    }
  }

  try {   //opens a try block to handle async methods
    const { team_name, ballpark, website } = team;    //pulls the team_name, ballpark and website properties off of the team object
    const id = await database('teams').insert(team, 'id');  //assigns an id variable to the return value of inserting a team object into the teams table
    res.status(201).json({    //sends a 201 CREATED status code and a json object of the created team, with the new team id, which again is given as an array from the database insert
      id: id[0],
      team_name,
      ballpark,
      website
    })
  } catch (error) {   //opens a catch block to handle server error
    res.status(500).json({ error: 'Internal server error.' })   //sends a statsu code of 500 and returns an error obejct with an error message
  }
});

app.post('/api/v1/teams/:id/roster', async (req, res) => {    //sets a POST endpoint of /api/v1/teams/:id/roster to add a new player to a specific teams roster by team id
  const body = req.body;    //grabs the body object off of the request object
  const { id } = req.params;    //grabs the id off of the request params object
  const player = {...body, team_id: Number(id)};    //creates a player object with the spread of the body object and team_id to the request params id

  for (let requiredParameter of ['first_name', 'last_name']) {    //creates a for loop to check for required parameters on the request body
    if (!player[requiredParameter]) {
      return res.status(422).send({ error: `Expected format: { first_name: <String>, last_name: <String> }. You're missing a '${requiredParameter}' property.` });    //if any of the request body properties are missing or incorrect, sends a status code of 422 unprocessable entity with an error object and error message in the response body
    }
  }

  try {   //opens a try block for async methods
    const { first_name, last_name } = player;   //grabs the first_name and last_name properties off of the player object
    const id = await database('players').insert(player, 'id');    //sets and id array from the return value of inserting a player into the player table
    res.status(201).json({    //sends a status code 201 CREATED and a json object of the created player with the player id in the response body
      id: id[0],
      first_name,
      last_name,
    })    
  } catch (error) {   //opens a catch block to handle server errors
    res.status(500).json({ error: 'Internal server error.' });    //sends a status code of 500 and an error object with an error message in the response body
  }
});

app.delete('/api/v1/players/:id', async (req, res) => {   //sets a DELETE endpoint /api/v1/players/:id to delete a specific player based on id
  const { id } = req.params;    //grabs the id off of the request parameters object
  try {   //opens a try block to handle async methods
    await database('players').where('id', id).del();    //searches the players database for the player with an id that matches the request id and removes it from the database
    res.sendStatus(204)   //sends a status code 204 NO CONTENT in the response body
  } catch (error) { //opens catch block to handle server errors 
    res.status(500).send({ error: 'Internal server error.' })   //if any errors, sends 500 status code and a json error object with error message in response body
  }
})

app.listen(app.get('port'), () => {   //tells the app to listen for port activation, to get the port value set above
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);    //tells the user that the server is running on a certain port
});

