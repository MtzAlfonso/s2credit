import { PrismaClient } from '@prisma/client';
import { generateMD5Hash } from '../shared/utils/hash';
const prisma = new PrismaClient();

(async function main() {
  const user = await prisma.user.upsert({
    where: { username: 's2credit' },
    update: {},
    create: {
      username: 's2credit',
      firstName: 'José',
      lastName: 'Martínez',
      password: generateMD5Hash('s2creditJosé'),
    },
  });

  console.log({ user });
})()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
