import { z } from 'zod';

export const createReservationSchema = z.object({
  restaurantId: z.string().uuid({ message: "ID de restaurante inválido" }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Data inválida, use formato YYYY-MM-DD",
  }),
  time: z.string().refine((val) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(val), {
    message: "Hora inválida, use formato HH:mm",
  }),
  partySize: z.number().int().min(1).max(20, { message: "Tamanho do grupo deve estar entre 1 e 20" }),
  customerName: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  customerPhone: z.string().min(9, { message: "Número de telefone inválido" }),
  customerEmail: z.string().email({ message: "Email inválido" }).optional(),
  customerNif: z.string().optional(),
  notes: z.string().max(500, { message: "Notas não podem exceder 500 caracteres" }).optional(),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;

export const getReservationsSchema = z.object({
  restaurantId: z.string(),
  date: z.string().refine((val) => !isNaN(Date.parse(val))),
  shiftId: z.string().optional(),
});

export type GetReservationsInput = z.infer<typeof getReservationsSchema>;