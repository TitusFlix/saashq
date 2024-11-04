import { NextResponse } from 'next/server';
import { prismadb } from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prismadb.branch.findMany({});
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching branch data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch branch data' },
      { status: 500 }
    );
  }
}
