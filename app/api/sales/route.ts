import { NextResponse } from 'next/server';
import { prismadb } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const branch = Number(searchParams.get('branch'));

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: 'Start date and end date are required' },
      { status: 400 }
    );
  }

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
        ...(branch !== 0 && { branch_id: { equals: branch } }),
      },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching sales data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales data' },
      { status: 500 }
    );
  }
}
