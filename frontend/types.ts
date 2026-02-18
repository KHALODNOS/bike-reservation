export type BikeCategory = 'All' | 'VTT' | 'City' | 'Electric';

export interface Bike {
  _id?: string;
  id: number;
  nom: string;
  type: BikeCategory | string;
  city?: string;
  prix: number;
  images: string[];
  available?: boolean;
}

export interface FilterState {
  city: string;
  type: BikeCategory;
}