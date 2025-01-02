import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Map from '@/models/Map';
import { getSession } from '@/action';
import { ObjectId } from 'mongodb';

export async function GET(req: Request, { params }: { params: { mapId: string } }) {
  await connectDB(); // เชื่อมต่อกับฐานข้อมูล

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { mapId } = await params; // ใช้ await เพื่อรับค่า params

    // ตรวจสอบว่า mapId ไม่เป็น undefined และมีค่า
    if (!mapId || typeof mapId !== 'string' || mapId.length !== 24 || !ObjectId.isValid(mapId)) {
      return NextResponse.json({ error: 'Invalid map ID format' }, { status: 400 });
    }

    const map = await Map.findOne({
      _id: new ObjectId(mapId), // ใช้ ObjectId ในการค้นหาข้อมูล
      userId: session.userId,
    });

    if (!map) {
      return NextResponse.json({ error: 'Map not found' }, { status: 404 });
    }

    return NextResponse.json(map);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch map' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { mapId: string } }) {
  await connectDB();

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { mapId } = await params; 

    
    if (!mapId || typeof mapId !== 'string' || mapId.length !== 24 || !ObjectId.isValid(mapId)) {
      return NextResponse.json({ error: 'Invalid map ID format' }, { status: 400 });
    }

    const map = await Map.findOneAndDelete({
      _id: new ObjectId(mapId), 
      userId: session.userId,
    });

    if (!map) {
      return NextResponse.json({ error: 'Map not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Map deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete map' }, { status: 500 });
  }
}
