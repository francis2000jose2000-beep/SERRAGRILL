import { NextResponse } from 'next/server';
import { createReservationSchema, CreateReservationInput } from '../../../lib/validations/reservation';
import { createGuestReservation } from '../../../lib/services/reservationService';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validatedData: CreateReservationInput = createReservationSchema.parse(body);

    const reservation = await createGuestReservation(validatedData);

    return NextResponse.json({ success: true, data: reservation }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors.map((e) => e.message).join(', ') },
        { status: 400 }
      );
    }

    if (error.message === 'Sem disponibilidade para este turno') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    console.error('Erro ao criar reserva:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}