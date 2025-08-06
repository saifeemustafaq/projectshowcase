import { NextResponse } from 'next/server';
import { getFeatureFlagsServer, setFeatureFlagsServer } from '@/lib/feature-flags-server';
import { FeatureFlags } from '@/types/feature-flags';

export async function GET() {
  try {
    const flags = await getFeatureFlagsServer();
    return NextResponse.json(flags);
  } catch (error) {
    console.error('Error fetching feature flags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feature flags' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const flags: FeatureFlags = await request.json();
    await setFeatureFlagsServer(flags);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating feature flags:', error);
    return NextResponse.json(
      { error: 'Failed to update feature flags' },
      { status: 500 }
    );
  }
}
