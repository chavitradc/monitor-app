import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Map from '@/models/Map';
import { getSession } from '@/action';

export async function POST(req: Request, { params }: { params: { mapId: string } }) {
  // Await the params before using them
  const { mapId } = await params;

  await connectDB();
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const map = await Map.findOneAndUpdate(
      { _id: mapId, userId: session.userId }, // Use mapId after awaiting params
      { $push: { markers: body } },
      { new: true }
    );
    
    if (!map) return NextResponse.json({ error: 'Map not found' }, { status: 404 });
    return NextResponse.json(map, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to add marker' }, { status: 400 });
  }
}
