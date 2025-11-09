import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: ["query"]
});

prisma.$on('query', (e: any) => {
  console.log('------------------------------------------------')
  console.log('Query: ' + e.query)
  console.log('Params: ' + e.params)
  console.log('Duration: ' + e.duration + 'ms')
  console.log('------------------------------------------------')
})