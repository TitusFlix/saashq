import { salesSchema } from '@/app/[locale]/(routes)/crm/sales/table-data/schema';
import { prismadb } from '@/lib/prisma';
import axios from 'axios';
import { z } from 'zod';

import type { GetSalesParams } from '../shared.types';
type SalesData = z.infer<typeof salesSchema>;

export const fetchSales2 = async (amt: number): Promise<SalesData[]> => {
  try {
    const response = await axios.get('http://localhost:3000/api/crm/sale');
    const sales = response.data.sales;

    const filteredSales = sales.filter(
      (sale: { amount: number }) => sale.amount > amt
    );

    // Validate the filtered sales data against the schema
    const validatedSales = z.array(salesSchema).parse(filteredSales);

    console.log(validatedSales);
    return validatedSales;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw new Error('Failed to fetch sales data');
  }
};

export const fetchSales123 = async (
  startDate: Date,
  endDate: Date
): Promise<SalesData[]> => {
  const startOfDay = new Date(startDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(endDate);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const data = await prismadb.sales.findMany({
      where: {
        date1: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    // Validate and transform the data to match SalesData type
    const validatedData = data.map((sale) => {
      const validatedSale = salesSchema.parse({
        ...sale,
        date1: new Date(sale.date1), // Ensure date1 is a Date object
        created_at: sale.created_at ? new Date(sale.created_at) : undefined,
        updated_at: sale.updated_at ? new Date(sale.updated_at) : undefined,
      });
      return validatedSale;
    });

    return validatedData;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw new Error('Failed to fetch sales data');
  }
};

export const fetchSales4 = async (startDate: Date, endDate: Date) => {
  const startOfDay = new Date(startDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(endDate);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const data = await prismadb.sales.findMany({
      where: {
        date1: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
    return data;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw new Error('Failed to fetch sales data');
  }
};

export const fetchSales5 = async () => {
  try {
    const data = await prismadb.sales.findMany();
    return data;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw new Error('Failed to fetch sales data');
  }
};

export const fetchSales = async (params: GetSalesParams) => {
  const startOfDay = new Date(params.startDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(params.endDate);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const data = await prismadb.sales.findMany({
      where: {
        date1: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
    return data;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw new Error('Failed to fetch sales data');
  }
};

export const calculateTotalAmount = (sales: Array<{ amount: number }>) =>
  sales.reduce((sum, sale) => sum + (sale.amount || 0), 0);
