import { prismadb } from '@/lib/prisma';

export const fetchBranches = async () => {
  try {
    const data = await prismadb.branch.findMany();
    return data;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw new Error('Failed to fetch sales data');
  }
};
