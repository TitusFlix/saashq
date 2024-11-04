import { NextResponse } from 'next/server';
import Imap from 'imap';
// import type { ParsedMail } from 'mailparser';
import { simpleParser } from 'mailparser';

export const dynamic = 'force-dynamic';

interface Email {
  body?: string;
  subject?: string;
  from?: string;
  date?: Date;
}

export async function GET(): Promise<NextResponse> {
  // Validate environment variables first
  if (
    !process.env.IMAP_USER ||
    !process.env.IMAP_PASSWORD ||
    !process.env.IMAP_HOST
  ) {
    return NextResponse.json(
      { error: 'Missing IMAP configuration' },
      { status: 500 }
    );
  }

  const imap = new Imap({
    user: process.env.IMAP_USER,
    password: process.env.IMAP_PASSWORD,
    host: process.env.IMAP_HOST,
    port: Number(process.env.IMAP_PORT) || 993,
    tls: true,
  });

  try {
    return await new Promise<NextResponse>((resolve, reject) => {
      const emails: Email[] = [];

      imap.once('ready', () => {
        imap.openBox('INBOX', true, (err) => {
          if (err) {
            imap.end();
            reject(
              NextResponse.json(
                { error: 'Failed to open inbox' },
                { status: 500 }
              )
            );
            return;
          }

          const f = imap.seq.fetch('1:3', {
            bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
            struct: true,
          });

          f.on('message', (msg) => {
            const email: Email = {};

            msg.on('body', (stream, info) => {
              let buffer = '';
              stream.on('data', (chunk) => {
                buffer += chunk.toString('utf8');
              });

              stream.once('end', () => {
                simpleParser(buffer, (err, mail) => {
                  if (err) return;
                  if (info.which === 'TEXT') {
                    email.body = mail.text;
                  } else {
                    email.subject = mail.subject;
                    email.from = mail.from?.text;
                    email.date = mail.date;
                  }
                });
              });
            });

            msg.once('end', () => {
              emails.push(email);
            });
          });

          f.once('error', (err) => {
            imap.end();
            reject(
              NextResponse.json(
                { error: `Fetch error: ${err.message}` },
                { status: 500 }
              )
            );
          });

          f.once('end', () => {
            imap.end();
            resolve(NextResponse.json(emails));
          });
        });
      });

      imap.once('error', (err: Error) => {
        console.error(err);
        reject(
          NextResponse.json({ error: 'IMAP connection error' }, { status: 500 })
        );
      });

      imap.connect();
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
