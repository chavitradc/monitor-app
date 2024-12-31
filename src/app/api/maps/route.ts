// app/api/maps/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Map from '@/models/Map';
import { getSession } from '@/action';


export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const maps = await Map.find({ userId: session.userId });
    return NextResponse.json(maps);
  } catch (error) {
    console.error('Error fetching maps:', error);
    return NextResponse.json(
      { error: 'Error fetching maps' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.name) {
      return NextResponse.json(
        { error: 'Map name is required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const map = await Map.create({
      userId: session.userId,
      name: body.name,
      markers: []
    });

    return NextResponse.json(map, { status: 201 });
  } catch (error) {
    console.error('Error creating map:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// New DELETE API for deleting a map
export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mapId } = await request.json();
    if (!mapId) {
      return NextResponse.json(
        { error: 'Map ID is required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const map = await Map.findOne({ _id: mapId });

    if (!map) {
      return NextResponse.json(
        { error: 'Map not found' },
        { status: 404 }
      );
    }

    if (map.userId.toString() !== session.userId) {
      return NextResponse.json(
        { error: 'You are not authorized to delete this map' },
        { status: 403 }
      );
    }

    // Delete the map
    await Map.deleteOne({ _id: mapId });

    return NextResponse.json({ message: 'Map deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting map:', error);
    return NextResponse.json(
      { error: 'Error deleting map' },
      { status: 500 }
    );
  }
}
