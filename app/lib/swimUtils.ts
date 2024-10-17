

// utils/swimUtils.ts
import { createClient } from '@/utils/supabase/client';
import { SwimEvent } from '../../app/lib/types';

export async function getSwimEventsForSwimmer(swimmerId: string): Promise<SwimEvent[]> {
  const supabase = createClient();

  // Fetch swimmer's profile data
  const { data: profileData , error: profileError } = await supabase
    .from('profiles')
    .select('id, gender')
    .eq('id', swimmerId)
    .single();

  if (profileError || !profileData) {
    console.error('Error fetching swimmer profile:', profileError);
    return [];
  }

  // Fetch swimmer's specific data
  const { data: swimmerData, error: swimmerError } = await supabase
    .from('swimmers')
    .select('date_of_birth')
    .eq('id', swimmerId)
    .single();

  if (swimmerError || !swimmerData) {
    console.error('Error fetching swimmer data:', swimmerError);
    return [];
  }

  // Calculate age group based on date of birth
  const ageGroup = calculateAgeGroup(swimmerData.date_of_birth);

  // Fetch swim events from swim_standards table based on swimmer's gender and calculated age group
  const { data: standardsData, error: standardsError } = await supabase
    .from('swim_standards')
    .select('event, course')
    .eq('gender', profileData.gender)
    .eq('age_group', ageGroup);

  if (standardsError) {
    console.error('Error fetching swim standards:', standardsError);
    return [];
  }

  // Remove duplicates and transform the standards data into SwimEvent format
  const uniqueEvents = Array.from(new Set(standardsData.map(s => `${s.event}-${s.course}`)))
    .map(eventCourse => {
      const [event, course] = eventCourse.split('-');
      return { event, course };
    });

  const events: SwimEvent[] = uniqueEvents.map((standard, index) => ({
    id: index.toString(),
    name: standard.event,
    course: standard.course
  }));

  // Custom order for strokes: FR, BK, BR, FL, IM
  const strokeOrder = { 'FR': 1, 'BK': 2, 'BR': 3, 'FL': 4, 'IM': 5 };

  // Helper function to parse distance and stroke from event name
  const parseEvent = (eventName: string): { distance: number, stroke: keyof typeof strokeOrder } => {
    const [distance, stroke] = eventName.split(' ');
    return {
      distance: parseInt(distance),
      stroke: stroke as keyof typeof strokeOrder
    };
  };

  // Sort events by distance and then by stroke
  events.sort((a, b) => {
    const eventA = parseEvent(a.name);
    const eventB = parseEvent(b.name);
    
    if (eventA.distance !== eventB.distance) {
      return eventA.distance - eventB.distance;
    }
    
    // Custom order for strokes: FR, BK, BR, FL, IM
    const strokeOrder = { 'FR': 1, 'BK': 2, 'BR': 3, 'FL': 4, 'IM': 5 };
    return (strokeOrder[eventA.stroke] || 6) - (strokeOrder[eventB.stroke] || 6);
  });

  return events;
}

function calculateAgeGroup(dateOfBirth: string): string {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age <= 10) return '10 & under';
  if (age <= 12) return '11-12';
  if (age <= 14) return '13-14';
  if (age <= 16) return '15-16';
  return '17-18';
}

export function parseEvent(eventName: string) {
  const [distance, stroke] = eventName.split(' ');
  return {
    distance: parseInt(distance),
    stroke: stroke
  };
}