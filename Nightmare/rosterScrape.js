const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: false });
import { teamURLs } from '../teams';

const getRoster = (url) => {
  nightmare
    .goto(`http://m.mlb.com/bos/roster/40-man/`)
    .wait('.module')
    .evaluate(() => {
      const players = []
      const playerDisplay = Array.from(document.querySelectorAll('tbody'));
      const regexPlayerData = playerDisplay.map(player => player.innerText);
      const sectionedPlayerData = regexPlayerData.map(player => player.split('\t'));
      const sectionedPlayerNames = sectionedPlayerData.map(section => section.filter(item => item.includes(' ')));
      
      sectionedPlayerNames.forEach(section => {
        section.forEach(player => {
          players.push(player)
        });
      });
      return players.map(player => ({
        firstName: player.split(' ')[0],
        lastName: player.split(' ')[1]
      }));
    })
    .end()
    .then(result => console.log(result))
    .catch(err => console.log(err))
};

getRoster();















// nightmare
//   .goto('https://www.mlb.com/team')
//   .click('a[href="https://www.mlb.com/team"]')
//   .wait('.p-featured-content')
//   .evaluate(() => {

//   })
//   .end()
//   .then(result => console.log(result))
//   .catch(err => console.log(err))
