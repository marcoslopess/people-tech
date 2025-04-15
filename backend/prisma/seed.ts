import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany(); // limpa a tabela

  await prisma.user.createMany({
    data: [
      { name: 'Alice Silva', email: 'alice@email.com' },
      { name: 'Bruno Costa', email: 'bruno@email.com' },
      { name: 'Carla Lima', email: 'carla@email.com' },
    ],
  });

  console.log('✅ Seed executado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
