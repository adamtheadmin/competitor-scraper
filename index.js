const searchTheRealReal = require('./therealreal');

(async () => {
  const items = await searchTheRealReal("LOUIS VUITTON Damier Ebene Speedy 30");
  console.log(items);
})();
