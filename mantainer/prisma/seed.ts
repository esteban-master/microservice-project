import { PrismaClient } from '@prisma/client';

const products = [
  { name: 'Product 1', code: '111' },
  { name: 'Product 2', code: '222' },
  { name: 'Product 3', code: '333' },
];

const entities = [
  { name: 'Entity 1' },
  { name: 'Entity 2' },
  { name: 'Entity 3' },
  { name: 'Entity 4' },
];

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany()
  await prisma.entity.deleteMany()
  await prisma.provider.deleteMany()
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }
  for (const entity of entities) { 
    await prisma.entity.create({
      data: entity,
    });
  }
  const entitiesDB = await prisma.entity.findMany();
  const providers = entitiesDB.map((item, i) => ({
    entityId: item.id,
    companyEmail: `email${i}@gmail.com`,
  }));
  for (const provider of providers) {
    await prisma.provider.create({
      data: provider,
    });
  }
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
