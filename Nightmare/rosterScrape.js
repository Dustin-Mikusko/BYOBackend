const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: false });
import { teams } from '../teams';

// const getRoster = async (team) => {
//   // const { urlCode, roster, id } = team;
//   const url =`http://m.mlb.com/${urlCode}/roster/40-man/`;
//   nightmare
//     .goto(url)
//     .wait(2000)
//     .evaluate(() => {
//       const playerDisplay = Array.from(document.querySelectorAll('tbody'));
//       const regexPlayerData = playerDisplay.map(player => player.innerText);
//       const sectionedPlayerData = regexPlayerData.map(player => player.split('\t'));
//       const sectionedPlayerNames = sectionedPlayerData.map(section => section.filter(item => item.includes(' ')));

//       sectionedPlayerNames.forEach(section => {
//         section.forEach(player => {
//           roster.push(player)
//         });
//       });
//       return roster.map(player => ({
//         firstName: player.split(' ')[0],
//         lastName: player.split(' ')[1],
//         teamId: id
//       }));
//     })
//     .end()
//     .then(result => result)
//     .catch(err => console.log(err))
// };

// const getAllRosters = teams => {
//   return teams.map(team => {
//     getRoster(team);
//   });
// }

// getAllRosters(teams);

const getRoster = () => {
  // const { urlCode, roster } = team;
  nightmare
    .goto(`http://m.mlb.com/was/roster/40-man/`)
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

// getRoster();
