import { authOptions } from "@/lib/auth";
// import { s3Client } from "@/lib/digital-ocean-s3";
import { getRossumToken } from "@/lib/get-rossum-token";
import { prismadb } from "@/lib/prisma";
// import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { annotationId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const queueId = process.env.ROSSUM_QUEUE_ID;
  if (!queueId) {
    return NextResponse.json({ error: "No queueId provided" }, { status: 400 });
  }

  const { annotationId } = params;
  if (!annotationId) {
    return NextResponse.json({ error: "No annotationId provided" }, { status: 400 });
  }

  const token = await getRossumToken();
  if (!token) {
    return NextResponse.json({ error: "No Rossum token" }, { status: 400 });
  }

  const response = await fetch(
    `${process.env.ROSSUM_API_URL}/queues/${queueId}/export/?format=json&id=${annotationId}`,
    {
      method: "POST",
      headers: { Authorization: token },
    }
  );

  const data = await response.json();

  if (data.results[0]?.status === "importing") {
    return NextResponse.json(
      { error: "Data from Rossum API not ready yet!" },
      { status: 400 }
    );
  }

  const extractedData = extractDataFromAnnotation(data);

  // const buffer = Buffer.from(JSON.stringify(data));
  const fileNameJSON = `rossum/invoice_annotation-${annotationId}.json`;

  // const bucketParamsJSON = {
  //   Bucket: process.env.DO_BUCKET,
  //   Key: fileNameJSON,
  //   Body: buffer,
  //   ContentType: "application/json",
  //   ContentDisposition: "inline",
  // };

  // await s3Client.send(new PutObjectCommand(bucketParamsJSON));

  const urlJSON = `https://${process.env.DO_BUCKET}.${process.env.DO_REGION}.digitaloceanspaces.com/${fileNameJSON}`;

  const invoice = await prismadb.invoices.findFirst({
    where: { rossum_annotation_id: annotationId },
  });

  if (!invoice) {
    return NextResponse.json({ error: "No invoice found" }, { status: 400 });
  }

  await updateInvoice(invoice.id, extractedData, urlJSON, data.results[0].status);

  return NextResponse.json({ message: "Annotation processed successfully", data: extractedData }, { status: 200 });
}

function extractDataFromAnnotation(data: any) {
  const sections = {
    basicInfoSection: data.results[0]?.content.find((section: any) => section.schema_id === "basic_info_section"),
    amountsSection: data.results[0]?.content.find((section: any) => section.schema_id === "amounts_section"),
    paymentInfoSection: data.results[0]?.content.find((section: any) => section.schema_id === "payment_info_section"),
    vendorSection: data.results[0]?.content.find((section: any) => section.schema_id === "vendor_section"),
  };

  return {
    basicInfo: extractBasicInfo(sections.basicInfoSection),
    amounts: extractAmounts(sections.amountsSection),
    paymentInfo: extractPaymentInfo(sections.paymentInfoSection),
    vendor: extractVendorInfo(sections.vendorSection),
  };
}

function extractBasicInfo(section: any) {
  return {
    document_id: getDataPointValue(section, "document_id"),
    order_id: getDataPointValue(section, "order_id"),
    document_type: getDataPointValue(section, "document_type"),
    date_issue: parseDate(getDataPointValue(section, "date_issue")),
    date_due: parseDate(getDataPointValue(section, "date_due")),
    language: getDataPointValue(section, "language"),
  };
}

function extractAmounts(section: any) {
  return {
    amount_total: getDataPointValue(section, "amount_total"),
    currency: getDataPointValue(section, "currency"),
  };
}

function extractPaymentInfo(section: any) {
  return {
    vendor_bank: getDataPointValue(section, "vendor_bank"),
    account_num: getDataPointValue(section, "account_num"),
    bank_num: getDataPointValue(section, "bank_num"),
  };
}

function extractVendorInfo(section: any) {
  return {
    sender_name: getDataPointValue(section, "sender_name"),
    sender_ic: getDataPointValue(section, "sender_ic"),
    sender_vat_id: getDataPointValue(section, "sender_vat_id"),
    sender_email: getDataPointValue(section, "sender_email"),
    vendor_street: getDataPointValue(section, "vendor_street"),
    vendor_city: getDataPointValue(section, "vendor_city"),
    vendor_zip: getDataPointValue(section, "vendor_zip"),
  };
}

function getDataPointValue(section: any, schemaId: string) {
  return section?.children.find((datapoint: any) => datapoint.schema_id === schemaId)?.value;
}

function parseDate(dateString: string): Date | null {
  if (!dateString) return null;
  const [year, month, day] = dateString.split("-").map(Number);
  if (year && month && day) {
    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
  }
  return null;
}

async function updateInvoice(invoiceId: string, extractedData: any, urlJSON: string, status: string) {
  await prismadb.invoices.update({
    where: { id: invoiceId },
    data: {
      variable_symbol: extractedData.basicInfo.document_id,
      date_of_case: extractedData.basicInfo.date_issue,
      date_due: extractedData.basicInfo.date_due,
      document_type: extractedData.basicInfo.document_type,
      order_number: extractedData.basicInfo.order_id,
      invoice_number: extractedData.basicInfo.document_id,
      invoice_amount: extractedData.amounts.amount_total,
      invoice_currency: extractedData.amounts.currency,
      invoice_language: extractedData.basicInfo.language,
      partner: extractedData.vendor.sender_name,
      partner_business_street: extractedData.vendor.vendor_street,
      partner_business_city: extractedData.vendor.vendor_city,
      partner_business_zip: extractedData.vendor.vendor_zip,
      partner_VAT_number: extractedData.vendor.sender_ic,
      partner_TAX_number: extractedData.vendor.sender_vat_id,
      partner_bank: extractedData.paymentInfo.vendor_bank,
      partner_account_number: extractedData.paymentInfo.account_num,
      partner_account_bank_number: extractedData.paymentInfo.bank_num,
      partner_email: extractedData.vendor.sender_email,
      rossum_status: status,
      rossum_annotation_json_url: urlJSON,
    },
  });
}