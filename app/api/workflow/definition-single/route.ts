import { authOptions } from '@/lib/auth';
import { prismadb } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Response schema definition (commented out for now as it's not being used)
/*
const _ResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  global: z.record(z.string(), z.any()).optional(),
  definitionStatus: z.enum(['active', 'inactive']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  uiObject: z.object({
    react: z.object({
      nodes: z.array(z.any()),
      edges: z.array(z.any()),
    }),
  }),
})

export type ResponseSchemaType = z.infer<typeof _ResponseSchema>
*/

export async function GET(
  request: NextRequest,
  { params }: { params: { definitionId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Unauthenticated', { status: 401 });
  }

  if (!params.definitionId) {
    return new NextResponse('Definition ID is required', { status: 400 });
  }

  try {
    const definition = await prismadb.definitions.findUnique({
      where: {
        id: params.definitionId,
      },
    });

    if (!definition) {
      return new NextResponse('Definition not found', { status: 404 });
    }

    return NextResponse.json(definition);
  } catch (error) {
    console.error('[DEFINITIONS_SINGLE_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
