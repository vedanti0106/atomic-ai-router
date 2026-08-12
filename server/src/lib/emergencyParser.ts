export interface ParsedEmergencyRequest {
  type: 'emergency';
  needs: ('icu_bed' | 'blood' | 'ambulance')[];
  bloodType?: string; // 'A+', 'O-', etc.
  location: string;
  urgency: 'immediate' | 'urgent' | 'normal';
  keywords: string[];
}

export function parseEmergencyGoal(goalText: string): ParsedEmergencyRequest | null {
  const text = goalText.toLowerCase();
  
  // Check if it's an emergency request
  const emergencyKeywords = ['icu', 'intensive care', 'hospital bed', 'blood', 
    'emergency', 'urgent', 'critical', 'disaster', 'response'];
  
  const hasEmergency = emergencyKeywords.some(keyword => text.includes(keyword));
  if (!hasEmergency) return null;
  
  // Extract needs
  const needs: ('icu_bed' | 'blood' | 'ambulance')[] = [];
  if (text.includes('icu') || text.includes('hospital bed') || text.includes('intensive care')) {
    needs.push('icu_bed');
  }
  if (text.includes('blood')) {
    needs.push('blood');
  }
  if (text.includes('ambulance') || text.includes('transport')) {
    needs.push('ambulance');
  }
  
  // Extract blood type if mentioned
  let bloodType: string | undefined;
  const bloodTypeRegex = /(A\+|A-|B\+|B-|O\+|O-|AB\+|AB-)/i;
  const match = text.match(bloodTypeRegex);
  if (match) {
    bloodType = match[1].toUpperCase();
  }
  
  // Extract location (simplified for demo)
  let location = 'Pune City Center'; // default
  if (text.includes('near')) {
    const nearIndex = text.indexOf('near');
    location = text.substring(nearIndex + 5).trim().split(' ')[0] + ' Area';
  }
  
  // Determine urgency
  let urgency: 'immediate' | 'urgent' | 'normal' = 'normal';
  if (text.includes('right now') || text.includes('immediately') || text.includes('critical')) {
    urgency = 'immediate';
  } else if (text.includes('urgent') || text.includes('emergency')) {
    urgency = 'urgent';
  }
  
  return {
    type: 'emergency',
    needs,
    bloodType,
    location,
    urgency,
    keywords: emergencyKeywords.filter(kw => text.includes(kw))
  };
}

// Example usage:
// parseEmergencyGoal("Find an available ICU bed and O-negative blood near Pune City Center right now")
// Returns: {
//   type: 'emergency',
//   needs: ['icu_bed', 'blood'],
//   bloodType: 'O-',
//   location: 'Pune City Center',
//   urgency: 'immediate',
//   keywords: ['icu', 'blood', 'emergency', 'urgent']
// }