import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Map from '@/models/Map';
import { getSession } from '@/action';

// Define the request body type
interface CreateMarkerRequest {
  latitude: number;
  longitude: number;
  description: string;
}

export async function POST(
  request: Request,
  { params }: { params: { mapId: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json() as CreateMarkerRequest;
    
    // Validate request body
    if (!body.latitude || !body.longitude || !body.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const map = await Map.findById(params.mapId);
    if (!map) {
      return NextResponse.json({ error: 'Map not found' }, { status: 404 });
    }

    // Verify map ownership
    if (map.userId.toString() !== session.userId) {
      return NextResponse.json(
        { error: 'Not authorized to modify this map' },
        { status: 403 }
      );
    }

    map.markers.push({
      latitude: body.latitude,
      longitude: body.longitude,
      description: body.description,
      status: 'pending'
    });

    await map.save();
    return NextResponse.json(map, { status: 201 });
  } catch (error) {
    console.error('Error creating marker:', error);
    
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