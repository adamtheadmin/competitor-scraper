import searchTheRealReal from './websites/therealreal';
import vestiaireCollective from './websites/vestiairecollective';

(async () => {
  const items = await vestiaireCollective("LOUIS VUITTON Damier Ebene Speedy 30");
  console.log(items);
})();
