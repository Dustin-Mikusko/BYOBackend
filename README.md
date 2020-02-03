# BYOBackend

This backend project builds a **RESTful API** that holds data on current MLB teams and their current 40-man roster (as of Jan. 2020). The data was collected by using the Nightmare webscraping library to scrape the MLB website for the teams and their basic info, along with scraping each of the teams website to gather the current 40-man roster for each players first and last name.

## Tech Stack
* **Node.js** using **Express** framework to handle routes for `GET`, `POST`, and `DELETE` requests
* **Knex** as a SQL query builder
* **PostgreSQL** Database

## Setup

* Clone down this repo and run `npm install`
* Run the server by using `npm start`

The server will run on `http://localhost:3000`. All endpoints are prefixed with `/api/v1`.

## Data Model

There are two tables, labeled `teams` and `players`.

### Teams Table
Each team in the table has an `id`, `team_name`, `ballpark` and `website` property.

Example team object: 
```
{
            "id": 74,
            "team_name": "Houston Astros",
            "ballpark": "Minute Maid Park",
            "website": "astros.com"
}
```

### Players Table
Each player in the table has an `id`, `first_name`, `last_name` and `team_id` property.

Example player object:
```
{
            "id": 229,
            "first_name": "Jose",
            "last_name": "Altuve"
}
```

## Endpoints

| Purpose | URL | Verb | Request Body | Sample Success Response |
|----|----|----|----|----|
| Get all teams |`/api/v1/teams`| GET | N/A | All teams on the server: `{teams: [{'id': 74, 'team_name': 'Houston Astros', 'ballpark': 'Minute Maid Park', 'website': 'astros.com'}, ...]` |
| Get specific team |`/api/v1/teams/:id`| GET | N/A | Specific team by url id: `{'id': 74, 'team_name': 'Houston Astros', 'ballpark': 'Minute Maid Park', 'website': 'astros.com'}` |
| Get 40-man roster for specific team |`/api/v1/teams/:id/roster`| GET | N/A | All players for specific team: `{roster: [{'id': 229, 'first_name': 'Jose', 'last_name': 'Altuve'}, {}, ...]}` |
| Get all players |`/api/v1/players`| GET | N/A | All players on the server: `{players: [{'id': 229, 'first_name': 'Jose', 'last_name': 'Altuve'}, {}, ...]}` |
| Add team to server |`/api/v1/teams`| POST | `{'team_name': 'Austin Rattlers', 'ballpark': '6th St Stadium', 'website': 'rattlers.com'}`| Upon successful post, newly created team with id: `{'id': 98, 'team_name': 'Austin Rattlers', 'ballpark': '6th St Stadium', 'website': 'rattlers.com'} |`

