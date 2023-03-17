import searchTheRealReal from './therealreal';
import searchRebag from "./rebag";
import db from './db';

(async () => {
  const searchTerm: string = "Speedy 30";
  const items = [
      ...await searchTheRealReal(searchTerm),
      ...await searchRebag(searchTerm),
  ];
  console.log(items);
  await db.$transaction(items
      .filter(item => !!item.id)
      .filter(item => item.price)
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
