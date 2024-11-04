import { z } from 'zod';

// Define the Sales schema using zod
export const salesSchema = z.object({
  id: z.number(),
  client_id: z.number(),
  branch_id: z.number(),
  date1: z.date(),
  name: z.string(),
  amount: z.number(),
  paid: z.string().length(1), // 'Y' or 'N'
  sale_type: z.enum(['cash', 'credit']),
  ref_id: z.number(),
  reference_no: z.string().nullable(),
  discount: z.number().nullable(),
  tax: z.number().nullable(),
  payment_mode: z.enum(['cash', 'card', 'insurance']).nullable(),
  remarks: z.string().nullable(),
  created_at: z.date().optional(), // If auto-generated, make it optional
  updated_at: z.date().optional(), // If auto-updated, make it optional
});

export type Sale = z.infer<typeof salesSchema>;
