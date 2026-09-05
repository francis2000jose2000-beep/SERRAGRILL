import prisma from '@prisma/client';
import { CreateReservationInput } from '../validations/reservation';
import { ReservationStatus } from '@prisma/client';

function generateReservationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `RES-${result}`;
}

async function findActiveShift(
  tx: any,
  restaurantId: string,
  reservationTime: Date,
  date: Date
) {
  const dayOfWeek = date.getDay();

  const shifts = await tx.shift.findMany({
    where: {
      restaurantId,
      daysOfWeek: {
        has: dayOfWeek,
      },
    },
  });

  const requestedHour = reservationTime.getHours();
  const requestedMinute = reservationTime.getMinutes();

  for (const shift of shifts) {
    const [startHour, startMinute] = shift.startTime.split(':').map(Number);
    const [endHour, endMinute] = shift.endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    const requestedMinutes = requestedHour * 60 + requestedMinute;

    if (requestedMinutes >= startMinutes && requestedMinutes < endMinutes) {
      return shift;
    }
  }

  return null;
}

export async function createGuestReservation(input: CreateReservationInput) {
  const { restaurantId, date, time, partySize, customerName, customerPhone, customerEmail, customerNif, notes } = input;

  const reservationDate = new Date(date);
  reservationDate.setHours(0, 0, 0, 0);

  const reservationTime = new Date(`1970-01-01T${time}:00Z`);
  /* ts-ignore */
  reservationTime.setMinutes(reservationTime.getMinutes());

  return await prisma.$transaction(async (tx: any) => {
    const shift = await findActiveShift(tx, restaurantId, reservationTime, reservationDate);

    if (!shift) {
      throw new Error('Sem disponibilidade para este turno.');
    }

    const currentReservations = await tx.reservation.aggregate({
      where: {
        restaurantId,
        shiftId: shift.id,
        date: reservationDate,
        status: {
          in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED, ReservationStatus.SEATED],
        },
      },
      _sum: {
        partySize: true,
      },
    });

    const totalPartySize = (currentReservations._sum.partySize || 0) + partySize;

    if (totalPartySize > shift.maxCovers) {
      throw new Error('Sem disponibilidade para este turno.');
    }

    const dbCustomer = await tx.customer.upsert({
      where: { phone: customerPhone },
      update: {
        name: customerName,
        email: customerEmail,
        nif: customerNif,
      },
      create: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        nif: customerNif,
      },
    });

    const code = generateReservationCode();

    const reservation = await tx.reservation.create({
      data: {
        code,
        date: reservationDate,
        time,
        partySize,
        status: ReservationStatus.CONFIRMED,
        notes,
        restaurantId,
        customerId: dbCustomer.id,
        shiftId: shift.id,
      },
      include: {
        customer: true,
        restaurant: true,
        shift: true,
      },
    });

    return reservation;
  });
}

export async function getReservationsByRestaurantAndDate(
  restaurantId: string,
  date: string,
  shiftId?: string
) {
  const searchDate = new Date(date);
  searchDate.setHours(0, 0, 0, 0);

  /* ts-ignore */
  return await prisma.reservation.findMany({
    where: {
      restaurantId,
      date: searchDate,
      ...(shiftId && { shiftId }),
    },
    include: {
      customer: true,
      shift: true,
      table: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}