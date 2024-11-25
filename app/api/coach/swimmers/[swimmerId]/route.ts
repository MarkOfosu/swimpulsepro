// app/api/coach/swimmers/[swimmerId]/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import type { SwimStandard } from '@/app/lib/types';

export const dynamic = 'force-dynamic';

// Add interfaces for the database schema
interface SwimmerProfile {
  first_name: string;
  last_name: string;
  gender: string;
}

interface DatabaseSwimmer {
  id: string;
  age_group: string;
  profiles: SwimmerProfile;
}

// Add interface for the API response
interface SwimmerResponse {
  swimmer: {
    id: string;
    first_name: string;
    last_name: string;
    age_group: string;
    gender: string;
  };
  standards: SwimStandard[];
}

export async function GET(
  request: Request,
  { params }: { params: { swimmerId: string } }
): Promise<NextResponse<SwimmerResponse | { error: string }>> {
  try {
    const supabase = createClient();
    const swimmerId = params.swimmerId;

    const { data: swimmerData, error: swimmerError } = await supabase
      .from('swimmers')
      .select(`
        id,
        age_group,
        profiles:profiles!inner (
          first_name,
          last_name,
          gender
        )
      `)
      .eq('id', swimmerId)
      .single<DatabaseSwimmer>();

    if (swimmerError) {
      return NextResponse.json(
        { error: swimmerError.message },
        { status: 404 }
      );
    }

    const { data: standards, error: standardsError } = await supabase
      .from('swimmer_standards')
      .select('*')
      .eq('swimmer_id', swimmerId)
      .returns<SwimStandard[]>();

    if (standardsError) {
      return NextResponse.json(
        { error: standardsError.message },
        { status: 500 }
      );
    }

    const response: SwimmerResponse = {
      swimmer: {
        id: swimmerData.id,
        first_name: swimmerData.profiles.first_name,
        last_name: swimmerData.profiles.last_name,
        age_group: swimmerData.age_group,
        gender: swimmerData.profiles.gender
      },
      standards: standards || []
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching swimmer details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}