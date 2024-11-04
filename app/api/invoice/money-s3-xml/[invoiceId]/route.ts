import { authOptions } from '@/lib/auth';
// import { s3Client } from '@/lib/digital-ocean-s3';
import { prismadb } from '@/lib/prisma';
import { fillXmlTemplate } from '@/lib/xml-generator';
// import { PutObjectAclCommand } from '@aws-sdk/client-s3';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ status: 401, body: { error: 'Unauthorized' } });
  }

  const url = new URL(request.url);
  const invoiceId = url.pathname.split('/').pop();

  if (!invoiceId) {
    return NextResponse.json({
      status: 400,
      body: { error: 'There is no invoice ID; invoice ID is mandatory' },
    });
  }

  const myCompany = await prismadb.myAccount.findFirst({});

  const invoiceData = await prismadb.invoices.findFirst({
    where: {
      id: invoiceId,
    },
  });

  const xmlString = fillXmlTemplate(invoiceData, myCompany);
  // const buffer = Buffer.from(xmlString);

  // const bucketParamsJSON = {
  //   Bucket: process.env.DO_BUCKET,
  //   Key: `xml/invoice-${invoiceId}.xml`,
  //   Body: buffer,
  //   ContentType: 'application/json',
  //   ContentDisposition: 'inline',
  // };

  // await s3Client.send(new PutObjectAclCommand(bucketParamsJSON));

  const urlMoneyS3 = `https://${process.env.DO_BUCKET}.${process.env.DO_REGION}.digitaloceanspaces.com/xml/invoice-${invoiceId}.xml`;

  await prismadb.invoices.update({
    where: {
      id: invoiceId,
    },
    data: {
      money_s3_url: urlMoneyS3,
    },
  });

  return NextResponse.json({ xmlString, invoiceData }, { status: 200 });
}
