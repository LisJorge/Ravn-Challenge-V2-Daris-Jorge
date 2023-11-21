import { PrismaClient } from "@prisma/client";

const prisma  = new PrismaClient();

async function main() {
  console.log('Seeding...');
  const categories = [
    {
      name: 'FOOD',
    },
    {
      name: 'TOY',
    }
  ]
  const categorySeeding = await Promise.all(categories.map(
    (category) => (prisma.category.upsert({
      where: { name: category.name},
      update: {},
      create: { ...category },
    }))))
  };
  
    
  
  main()
  .catch((e) => console.error(e))
  .finally(async () => {
  await prisma.$disconnect();
  });