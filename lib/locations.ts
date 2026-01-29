import { Location } from './types'

export const LOCATIONS: Location[] = [
  {
    id: 'loc1',
    name: 'Richmond Hill Heritage Centre',
    address: 'Visit the Heritage Centre to explore an exhibit, attend an afternoon tea, or take part in a program or workshop all while exploring Richmond Hill\'s history.',
    description: 'Heritage Centre & Programs',
    imageUrl: '/images/locations/History.jpg',
  },
  {
    id: 'loc2',
    name: 'Downtown Gems',
    address: 'Explore unique cultural spaces downtown: hidden archives, local sport champions, or guided walks and self-led tours!',
    description: 'Downtown Cultural Spaces',
    imageUrl: '/images/locations/DowntownGems.jpg',
  },
  {
    id: 'loc3',
    name: 'Richmond Hill David Dunlap Observatory',
    address: 'Attend stargazing programs, tours, live history experiences, or try out the Makerspace at this National Historic Site and home to Canada\'s largest telescope.',
    description: 'David Dunlap Observatory',
    imageUrl: '/images/locations/David_Dunlap_Observatory.PNG',
  },
  {
    id: 'loc4',
    name: 'Art Galleries',
    address: 'Visit galleries, artist-run spaces, exhibitions, and murals around our city.',
    description: 'Art Galleries & Public Art',
    imageUrl: '/images/locations/Art Gallery.jpg',
  },
  {
    id: 'loc5',
    name: 'Festivals and Events',
    address: 'Attend Canada Day, Ribfest, Doors Open, Studio Tour, Artwalk, Concerts in the Park, Moonlight Movies, or Merry Marketplace.',
    description: 'Festivals & City Events',
    imageUrl: '/images/locations/Events and Festivals.jpg',
  },
  {
    id: 'loc6',
    name: 'Richmond Hill Centre for Performing Arts',
    address: 'See a show, attend a live performance, or sign up for a theatre class or workshop for yourself or your child.',
    description: 'Live Shows & Performances',
    imageUrl: '/images/locations/Theatre.png',
  },
  {
    id: 'loc7',
    name: 'The Wave Pool',
    address: 'Slide into fun and ride the waves at The Wave Pool, a must‑do Richmond Hill adventure for your bonus stamp!',
    description: 'Wave Pool',
    imageUrl: '/images/locations/Wave Pool_Free_26.jpg',
    isBonus: true,
  },
]

export const getLocationById = (id: string): Location | undefined => {
  return LOCATIONS.find((loc) => loc.id === id)
}

