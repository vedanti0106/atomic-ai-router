import { findNearestHospitals, findBloodBanksWithType } from './medicalData.js';

export interface HospitalBedResponse {
  success: boolean;
  location: string;
  timestamp: string;
  hospitals: Array<{
    name: string;
    address: string;
    icuBedsAvailable: number;
    totalIcuBeds: number;
    distanceKm: number;
    contact: string;
    estimatedArrivalTime: string; // "15 minutes", "30 minutes", etc.
  }>;
}

export interface BloodBankResponse {
  success: boolean;
  location: string;
  bloodType: string;
  timestamp: string;
  bloodBanks: Array<{
    name: string;
    address: string;
    unitsAvailable: number;
    distanceKm: number;
    contact: string;
    estimatedArrivalTime: string;
  }>;
}

export async function getHospitalBeds(location: string): Promise<HospitalBedResponse> {
  const hospitals = findNearestHospitals(location, 5);
  
  return {
    success: true,
    location,
    timestamp: new Date().toISOString(),
    hospitals: hospitals.map(hospital => ({
      name: hospital.name,
      address: hospital.address,
      icuBedsAvailable: hospital.icuBedsAvailable,
      totalIcuBeds: hospital.totalIcuBeds,
      distanceKm: hospital.distanceKm,
      contact: hospital.contact,
      estimatedArrivalTime: `${Math.round(hospital.distanceKm * 3)} minutes` // Simple estimate
    }))
  };
}

export async function getBloodSupply(location: string, bloodType: string): Promise<BloodBankResponse> {
  const banks = findBloodBanksWithType(location, bloodType, 5);
  
  return {
    success: true,
    location,
    bloodType,
    timestamp: new Date().toISOString(),
    bloodBanks: banks.map(bank => ({
      name: bank.name,
      address: bank.address,
      unitsAvailable: bank.bloodTypes[bloodType],
      distanceKm: bank.distanceKm,
      contact: bank.contact,
      estimatedArrivalTime: `${Math.round(bank.distanceKm * 3)} minutes`
    }))
  };
}