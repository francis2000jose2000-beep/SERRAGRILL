'use server';

import { 
  createReservationSchema, 
  CreateReservationInput,
  getReservationsSchema,
  GetReservationsInput
} from '../../lib/validations/reservation';
import { 
  createGuestReservation, 
  getReservationsByRestaurantAndDate 
} from '../../lib/services/reservationService';
import { revalidatePath } from 'next/cache';

export async function createReservationAction(input: CreateReservationInput) {
  try {
    // 1. Validar dados com Zod
    const validatedData = createReservationSchema.parse(input);

    // 2. Chamar o serviço
    const reservation = await createGuestReservation(validatedData);

    // 3. Revalidar caminhos (ex: dashboard de reservas)
    revalidatePath('/admin/reservations');

    return {
      success: true,
      data: reservation,
    };
  } catch (error: any) {
    console.error('Erro ao criar reserva:', error);
    return {
      success: false,
      error: error.message || 'Ocorreu um erro ao processar a sua reserva.',
    };
  }
}

export async function getReservationsAction(input: GetReservationsInput) {
  try {
    // 1. Validar dados
    const { restaurantId, date, shiftId } = getReservationsSchema.parse(input);

    // 2. Chamar o serviço
    const reservations = await getReservationsByRestaurantAndDate(restaurantId, date, shiftId);

    return {
      success: true,
      data: reservations,
    };
  } catch (error: any) {
    console.error('Erro ao procurar reservas:', error);
    return {
      success: false,
      error: error.message || 'Erro ao carregar reservas.',
    };
  }
}
