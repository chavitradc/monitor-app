import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Map from '@/models/Map';
import { getSession } from '@/action';

export async function POST(req: Request) {
  await connectDB();
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const map = await Map.create({ ...body, userId: session.userId });
    return NextResponse.json(map, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to create map' }, { status: 400 });
  }
}

export async function GET() {
  await connectDB();
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const maps = await Map.find({ userId: session.userId });
    return NextResponse.json(maps);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to fetch maps' }, { status: 400 });
  }
}
