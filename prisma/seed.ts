import { PrismaClient } from '@prisma/client';
import { USERS_SEED } from './seeders';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');
  const categories = [
    {
      name: 'FOOD',
    },
    {
      name: 'TOY',
    },
  ];
  const categorySeeding = await Promise.all(
    categories.map((category) =>
      prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: { ...category },
      }),
    ),
  );
  const usersSeeding = await Promise.all(
    USERS_SEED.map((user) =>
      prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: { ...user },
      }),
    ),
  );
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
