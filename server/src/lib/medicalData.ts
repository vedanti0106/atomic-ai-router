// Mock data for Pune hospitals and blood banks
export interface Hospital {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  icuBedsAvailable: number;
  totalIcuBeds: number;
  distanceKm: number;
  contact: string;
  lastUpdated: string;
}

export interface BloodBank {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  bloodTypes: Record<string, number>; // Blood type -> units available
  distanceKm: number;
  contact: string;
  lastUpdated: string;
}

// Pune hospitals with ICU beds
export const puneHospitals: Hospital[] = [
  {
    id: 'hospital_1',
    name: 'Ruby Hall Clinic',
    latitude: 18.5204,
    longitude: 73.8567,
    address: '40, Sassoon Road, Pune 411001',
    icuBedsAvailable: 8,
    totalIcuBeds: 25,
    distanceKm: 2.5,
    contact: '+91 20 2612 6666',
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    id: 'hospital_2',
    name: 'Jehangir Hospital',
    latitude: 18.5158,
    longitude: 73.8552,
    address: '32, Sasoon Road, Pune 411001',
    icuBedsAvailable: 5,
    totalIcuBeds: 20,
    distanceKm: 3.1,
    contact: '+91 20 2605 0505',
    lastUpdated: '2024-01-15T11:15:00Z'
  },
  {
    id: 'hospital_3',
    name: 'Aditya Birla Memorial Hospital',
    latitude: 18.6187,
    longitude: 73.8037,
    address: 'Aditya Birla Hospital Marg, Pimpri-Chinchwad',
    icuBedsAvailable: 12,
    totalIcuBeds: 35,
    distanceKm: 8.2,
    contact: '+91 20 3071 7500',
    lastUpdated: '2024-01-15T09:45:00Z'
  },
  {
    id: 'hospital_4',
    name: 'Sahyadri Hospital',
    latitude: 18.5529,
    longitude: 73.8981,
    address: 'Kothrud, Pune 411038',
    icuBedsAvailable: 6,
    totalIcuBeds: 18,
    distanceKm: 4.7,
    contact: '+91 20 6720 0000',
    lastUpdated: '2024-01-15T12:00:00Z'
  },
  {
    id: 'hospital_5',
    name: 'Deenanath Mangeshkar Hospital',
    latitude: 18.5095,
    longitude: 73.8326,
    address: 'Erandwane, Pune 411004',
    icuBedsAvailable: 10,
    totalIcuBeds: 30,
    distanceKm: 5.3,
    contact: '+91 20 4015 1515',
    lastUpdated: '2024-01-15T10:00:00Z'
  }
];

// Pune blood banks with stock
export const puneBloodBanks: BloodBank[] = [
  {
    id: 'bloodbank_1',
    name: 'Pune District Blood Bank',
    latitude: 18.5204,
    longitude: 73.8567,
    address: 'Sassoon General Hospital Campus, Pune 411001',
    bloodTypes: {
      'A+': 45,
      'A-': 12,
      'B+': 38,
      'B-': 8,
      'O+': 62,
      'O-': 15,  // O-negative stock highlighted for demo
      'AB+': 18,
      'AB-': 5
    },
    distanceKm: 2.5,
    contact: '+91 20 2612 8000',
    lastUpdated: '2024-01-15T09:30:00Z'
  },
  {
    id: 'bloodbank_2',
    name: 'Ruby Hall Blood Bank',
    latitude: 18.5204,
    longitude: 73.8567,
    address: 'Ruby Hall Clinic, Sassoon Road',
    bloodTypes: {
      'A+': 32,
      'A-': 7,
      'B+': 28,
      'B-': 6,
      'O+': 48,
      'O-': 10,
      'AB+': 15,
      'AB-': 4
    },
    distanceKm: 2.6,
    contact: '+91 20 2612 6666',
    lastUpdated: '2024-01-15T10:00:00Z'
  },
  {
    id: 'bloodbank_3',
    name: 'Aditya Birla Blood Centre',
    latitude: 18.6187,
    longitude: 73.8037,
    address: 'Aditya Birla Hospital, Pimpri-Chinchwad',
    bloodTypes: {
      'A+': 25,
      'A-': 5,
      'B+': 22,
      'B-': 4,
      'O+': 35,
      'O-': 8,
      'AB+': 12,
      'AB-': 3
    },
    distanceKm: 8.2,
    contact: '+91 20 3071 7500',
    lastUpdated: '2024-01-15T11:00:00Z'
  }
];

// Helper functions
export function findNearestHospitals(location: string, limit: number = 5): Hospital[] {
  // For demo, return hospitals sorted by distance
  return [...puneHospitals]
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}

export function findBloodBanksWithType(
  location: string, 
  bloodType: string, 
  limit: number = 5
): BloodBank[] {
  // For demo, return blood banks with the requested blood type
  return puneBloodBanks
    .filter(bank => bank.bloodTypes[bloodType] > 0)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}