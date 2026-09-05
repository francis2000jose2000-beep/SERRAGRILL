import prisma from '../src/lib/prisma';

async function main() {
  // Criar 2 restaurantes
  const restaurantA = await prisma.restaurant.create({
    data: {
      name: 'Restaurante A',
      slug: 'restaurante-a',
      address: 'Rua da Restaurante A, 10',
      phone: '+351 21 123 4567',
      email: 'contacto@restaurantea.com',
      vendusApiKey: 'test_key_a',
      vendusRegisterId: 'test_register_a',
    },
  });

  const restaurantB = await prisma.restaurant.create({
    data: {
      name: 'Restaurante B',
      slug: 'restaurante-b',
      address: 'Rua da Restaurante B, 20',
      phone: '+351 21 765 4321',
      email: 'contacto@restauranteb.com',
      vendusApiKey: 'test_key_b',
      vendusRegisterId: 'test_register_b',
    },
  });

  // Criar turnos para cada restaurante
  const mealTurns = ['LUNCH', 'DINNER'] as const;

  for (const restaurant of [restaurantA, restaurantB]) {
    // LUNCH shift: 12:00 às 15:00, maxCovers: 30, todos os dias
    await prisma.shift.create({
      data: {
        restaurantId: restaurant.id,
        turn: 'LUNCH' as const,
        startTime: '12:00',
        endTime: '15:00',
        maxCovers: 30,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      },
    });

    // DINNER shift: 19:00 às 22:30, maxCovers: 40, todos os dias
    await prisma.shift.create({
      data: {
        restaurantId: restaurant.id,
        turn: 'DINNER' as const,
        startTime: '19:00',
        endTime: '22:30',
        maxCovers: 40,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      },
    });

    // Criar 3 mesas para cada restaurante
    const capacities = [2, 4, 6];
    for (let i = 0; i < 3; i++) {
      await prisma.table.create({
        data: {
          number: `Mesa ${i + 1}`,
          capacity: capacities[i],
          isActive: true,
          restaurantId: restaurant.id,
        },
      });
    }
  }

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });