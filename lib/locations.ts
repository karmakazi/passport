import { Location } from './types'

export const LOCATIONS: Location[] = [
  {
    id: 'loc1',
    name: "Explore Richmond Hill's History",
    address: 'Visit the Heritage Centre, join a program, attend afternoon tea, explore an exhibit, or take part in a heritage workshop.',
    description: 'Heritage Centre & Programs',
    imageUrl: '/images/locations/History.jpg',
  },
  {
    id: 'loc2',
    name: 'Discover Downtown Culture',
    address: 'Explore unique cultural spaces downtown — including the Local History Room, Sports Hall of Fame, Cultural Centre, guided walks, or self-led experiences.',
    description: 'Downtown Cultural Spaces',
    imageUrl: '/images/locations/DowntownGems.jpg',
  },
  {
    id: 'loc3',
    name: 'Experience the Universe at DDO',
    address: 'Attend stargazing, astronomy programs, tours, live history experiences, or explore the David Dunlap Observatory grounds.',
    description: 'David Dunlap Observatory',
    imageUrl: '/images/locations/David_Dunlap_Observatory.PNG',
  },
  {
    id: 'loc4',
    name: 'See Art in Galleries & Public Spaces',
    address: 'Visit galleries, artist-run spaces, exhibitions, murals, or discover public art across the city.',
    description: 'Art Galleries & Public Art',
    imageUrl: '/images/locations/Art Gallery.jpg',
  },
  {
    id: 'loc5',
    name: 'Attend a Festival or Event',
    address: 'Take part in city events and festivals like Canada Day, Ribfest, ArtWalk, Doors Open, concerts, movies, markets, or studio tours.',
    description: 'Festivals & City Events',
    imageUrl: '/images/locations/Events and Festivals.jpg',
  },
  {
    id: 'loc6',
    name: 'Enjoy Live Performance',
    address: 'See a show, attend a live performance, take a class or workshop, or watch a camp or community performance.',
    description: 'Live Shows & Performances',
    imageUrl: '/images/locations/Theatre.png',
  },
  {
    id: 'loc7',
    name: 'Make a Splash at the Wave Pool',
    address: "Visit Richmond Hill's wave pool for a fun bonus stamp.",
    description: 'Wave Pool',
    imageUrl: '/images/locations/Wave Pool_Free_26.jpg',
    isBonus: true,
  },
]

export const getLocationById = (id: string): Location | undefined => {
  return LOCATIONS.find((loc) => loc.id === id)
}

