import searchTheRealReal from './therealreal';
import db from './db';

(async () => {
  const items = await searchTheRealReal("LOUIS VUITTON Damier Ebene Speedy 30");
  console.log(items);
  await db.$transaction(items
      .filter(item => !!item.id)
      .filter(item => !isNaN(item.price))
      .map((item) => {
        return db.product.upsert({
          where: {remoteId: item.id},
          update: {
            name: item.name,
            brand: item.brand,
            price: item.price,
            remoteId: item.id
          },
          create: {
            name: item.name,
            brand: item.brand,
            price: item.price,
            remoteId: item.id
          }
        })
      }));
})();
