const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: false });

nightmare
  .goto('https://www.mlb.com/team')
  .click('a[href="https://www.mlb.com/team"]')
  .wait('.p-featured-content')
  .evaluate(() => {
    
  })
  .end()
  .then(result => console.log(result))
  .catch(err => console.log(err))
