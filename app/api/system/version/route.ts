import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    // Get the package.json from the root directory
    const packagePath = join(process.cwd(), 'package.json');
    const data = await fs.readFile(packagePath, 'utf8');

    const packageJson = JSON.parse(data);
    const version = packageJson.dependencies['next'];

    return NextResponse.json({ version });
  } catch (error) {
    console.error('Error reading package.json:', error);
    return NextResponse.json({ version: '0' }, { status: 500 });
  }
}
