import { Location } from './types'

export const LOCATIONS: Location[] = [
  {
    id: 'loc1',
    name: 'Downtown Coffee Co.',
    address: '123 Main St',
    description: 'Premium artisan coffee & pastries',
    icon: '☕',
  },
  {
    id: 'loc2',
    name: 'Sunset Bistro',
    address: '456 Oak Ave',
    description: 'Farm-to-table dining experience',
    icon: '🍽️',
  },
  {
    id: 'loc3',
    name: 'The Book Nook',
    address: '789 Elm St',
    description: 'Independent bookstore & reading lounge',
    icon: '📚',
  },
  {
    id: 'loc4',
    name: 'Fitness First Gym',
    address: '321 Pine Rd',
    description: 'State-of-the-art fitness center',
    icon: '💪',
  },
  {
    id: 'loc5',
    name: 'Green Leaf Market',
    address: '654 Maple Dr',
    description: 'Organic produce & local goods',
    icon: '🥬',
  },
  {
    id: 'loc6',
    name: 'Artisan Gallery',
    address: '987 Cedar Ln',
    description: 'Local art & handcrafted items',
    icon: '🎨',
  },
  {
    id: 'loc7',
    name: 'Slice of Heaven Pizza',
    address: '147 Birch Blvd',
    description: 'Wood-fired authentic pizzeria',
    icon: '🍕',
  },
  {
    id: 'loc8',
    name: 'Zen Yoga Studio',
    address: '258 Willow Way',
    description: 'Mindfulness & yoga classes',
    icon: '🧘',
  },
  {
    id: 'loc9',
    name: 'Sweet Treats Bakery',
    address: '369 Spruce St',
    description: 'Fresh baked goods daily',
    icon: '🧁',
  },
]

export const getLocationById = (id: string): Location | undefined => {
  return LOCATIONS.find((loc) => loc.id === id)
}

