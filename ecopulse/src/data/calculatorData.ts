export interface VehicleType {
  id: string;
  label: string;
  factor: number;
}

export const vehicleTypes: VehicleType[] = [
  { id: 'car_petrol', label: 'Petrol Car', factor: 0.21 },
  { id: 'car_diesel', label: 'Diesel Car', factor: 0.17 },
  { id: 'car_hybrid', label: 'Hybrid Car', factor: 0.11 },
  { id: 'car_ev', label: 'Electric Car', factor: 0.05 },
  { id: 'bus', label: 'Bus / Metro', factor: 0.04 },
  { id: 'bicycle', label: 'Bicycle / Walk', factor: 0 },
];

export interface DietType {
  id: string;
  label: string;
  kgPerYear: number;
}

export const dietTypes: DietType[] = [
  { id: 'heavy_meat', label: 'Heavy Meat', kgPerYear: 3300 },
  { id: 'medium_meat', label: 'Medium Meat', kgPerYear: 2500 },
  { id: 'low_meat', label: 'Low Meat', kgPerYear: 1900 },
  { id: 'vegetarian', label: 'Vegetarian', kgPerYear: 1700 },
  { id: 'vegan', label: 'Vegan', kgPerYear: 1500 },
];

export interface HeatingType {
  id: string;
  label: string;
  factor: number;
}

export const heatingTypes: HeatingType[] = [
  { id: 'gas', label: 'Natural Gas', factor: 2.0 },
  { id: 'electric', label: 'Electric', factor: 0.9 },
  { id: 'oil', label: 'Fuel Oil', factor: 2.7 },
  { id: 'none', label: 'No Heating', factor: 0 },
];

export const azerbaijanAvg = 3400;
export const worldAvg = 4700;

export const businessSectors = [
  { id: 'office', label: 'Office / Services', factorPerEmployee: 2.4 },
  { id: 'manufacturing', label: 'Manufacturing', factorPerEmployee: 8.6 },
  { id: 'retail', label: 'Retail / Hospitality', factorPerEmployee: 3.2 },
  { id: 'logistics', label: 'Logistics', factorPerEmployee: 12.1 },
];

export const treesPerTonCO2 = 45;
export const carbonCreditPricePerTon = 25;
