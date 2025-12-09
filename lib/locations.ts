import { Location } from './types'

export const LOCATIONS: Location[] = [
  {
    id: 'loc1',
    name: 'Downtown Coffee Co.',
    address: '123 Main St, Richmond Hill',
    description: 'Premium artisan coffee & pastries',
    imageUrl: '/images/locations/coffee-shop.jpg',
  },
  {
    id: 'loc2',
    name: 'Sunset Bistro',
    address: '456 Oak Ave, Richmond Hill',
    description: 'Farm-to-table dining experience',
    imageUrl: '/images/locations/bistro.jpg',
  },
  {
    id: 'loc3',
    name: 'The Book Nook',
    address: '789 Elm St, Richmond Hill',
    description: 'Independent bookstore & reading lounge',
    imageUrl: '/images/locations/bookstore.jpg',
  },
  {
    id: 'loc4',
    name: 'Fitness First Gym',
    address: '321 Pine Rd, Richmond Hill',
    description: 'State-of-the-art fitness center',
    imageUrl: '/images/locations/gym.jpg',
  },
  {
    id: 'loc5',
    name: 'Green Leaf Market',
    address: '654 Maple Dr, Richmond Hill',
    description: 'Organic produce & local goods',
    imageUrl: '/images/locations/market.jpg',
  },
  {
    id: 'loc6',
    name: 'Artisan Gallery',
    address: '987 Cedar Ln, Richmond Hill',
    description: 'Local art & handcrafted items',
    imageUrl: '/images/locations/gallery.jpg',
  },
  {
    id: 'loc7',
    name: 'Slice of Heaven Pizza',
    address: '147 Birch Blvd, Richmond Hill',
    description: 'Wood-fired authentic pizzeria',
    imageUrl: '/images/locations/pizza.jpg',
  },
  {
    id: 'loc8',
    name: 'Zen Yoga Studio',
    address: '258 Willow Way, Richmond Hill',
    description: 'Mindfulness & yoga classes',
    imageUrl: '/images/locations/yoga.jpg',
  },
  {
    id: 'loc9',
    name: 'Sweet Treats Bakery',
    address: '369 Spruce St, Richmond Hill',
    description: 'Fresh baked goods daily',
    imageUrl: '/images/locations/bakery.jpg',
  },
]

export const getLocationById = (id: string): Location | undefined => {
  return LOCATIONS.find((loc) => loc.id === id)
}

