import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Map from '@/models/Map';
import { getSession } from '@/action';


export async function PATCH(
  req: Request, 
  { params }: { params: { mapId: string; markerId: string } }
) {
  await connectDB();
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const map = await Map.findOneAndUpdate(
      { 
        _id: params.mapId, 
        userId: session.userId,
        'markers._id': params.markerId 
      },
      { $set: { 'markers.$.status': body.status } },
      { new: true }
    );
    if (!map) return NextResponse.json({ error: 'Map or marker not found' }, { status: 404 });
    return NextResponse.json(map);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to update marker' }, { status: 400 });
  }
}

export async function DELETE(
  req: Request, 
  { params }: { params: { mapId: string; markerId: string } }
) {
  await connectDB();
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const map = await Map.findOneAndUpdate(
      { _id: params.mapId, userId: session.userId },
      { $pull: { markers: { _id: params.markerId } } },
      { new: true }
    );
    if (!map) return NextResponse.json({ error: 'Map or marker not found' }, { status: 404 });
    return NextResponse.json(map);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to delete marker' }, { status: 400 });
  }
}