export interface VehicleType {
  id: string;
  labelKey: string;
  factor: number;
}

export const vehicleTypes: VehicleType[] = [
  { id: 'car_petrol', labelKey: 'calc.vehicle.petrol', factor: 0.21 },
  { id: 'car_diesel', labelKey: 'calc.vehicle.diesel', factor: 0.17 },
  { id: 'car_hybrid', labelKey: 'calc.vehicle.hybrid', factor: 0.11 },
  { id: 'car_ev', labelKey: 'calc.vehicle.ev', factor: 0.05 },
  { id: 'bus', labelKey: 'calc.vehicle.bus', factor: 0.04 },
  { id: 'bicycle', labelKey: 'calc.vehicle.bicycle', factor: 0 },
];

export const gridElectricFactor = 0.5; // kg CO2 / kWh (Azerbaijan avg)
export const spendingFactor = 0.25; // kg CO2 / $ default
export const wasteFactor = 0.5; // kg CO2 / kg waste
export const waterFactor = 0.3; // kg CO2 / m3 water
export const clothingFactor = 15; // kg CO2 / item (avg fast fashion)
export const digitalFactor = 0.05; // kg CO2 / GB or streaming hour

export const flightFactors = {
  shortHaul: 0.20, // kg CO2 per km
  longHaul: 0.12,  // kg CO2 per km
};

export const foodFactors = {
  beef: 27.0,      // kg CO2 per kg
  chicken: 6.9,    // kg CO2 per kg
  vegetables: 2.0, // kg CO2 per kg
};

export interface HeatingType {
  id: string;
  labelKey: string;
  factor: number;
}

export const heatingTypes: HeatingType[] = [
  { id: 'gas', labelKey: 'calc.heating.gas', factor: 2.0 }, // kg CO2 / m3
  { id: 'electric', labelKey: 'calc.heating.electric', factor: gridElectricFactor }, // Same as grid
  { id: 'oil', labelKey: 'calc.heating.oil', factor: 2.7 }, // kg CO2 / liter
  { id: 'none', labelKey: 'calc.heating.none', factor: 0 },
];

export const azerbaijanAvg = 3400;
export const worldAvg = 4700;

export const businessSectors = [
  { id: 'office', labelKey: 'calc.business.office', factorPerEmployee: 2.4 },
  { id: 'manufacturing', labelKey: 'calc.business.manufacturing', factorPerEmployee: 8.6 },
  { id: 'retail', labelKey: 'calc.business.retail', factorPerEmployee: 3.2 },
  { id: 'logistics', labelKey: 'calc.business.logistics', factorPerEmployee: 12.1 },
];

export const treesPerTonCO2 = 45;
export const carbonCreditPricePerTon = 25;
