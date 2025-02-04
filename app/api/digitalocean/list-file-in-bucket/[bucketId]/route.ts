import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
// import { s3Client } from '@/lib/digital-ocean-s3';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { bucketId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json('Unauthorized', { status: 401 });
  }

  const { bucketId } = params;

  if (!bucketId) {
    return NextResponse.json('No bucketId ', { status: 400 });
  }

  // const bucketParams = { Bucket: bucketId };

  // const data = await s3Client.send(new ListObjectsCommand(bucketParams));
  const data = null;
  console.log('Success', data);

  return NextResponse.json({ files: data, success: true }, { status: 200 });
}
