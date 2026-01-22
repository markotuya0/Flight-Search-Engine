import type { Flight, Airport } from '../domain/types';

// Mock airports data
const airports: Record<string, Airport> = {
  JFK: {
    code: 'JFK',
    name: 'John F. Kennedy International Airport',
    city: 'New York',
    country: 'United States',
  },
  LAX: {
    code: 'LAX',
    name: 'Los Angeles International Airport',
    city: 'Los Angeles',
    country: 'United States',
  },
  LHR: {
    code: 'LHR',
    name: 'Heathrow Airport',
    city: 'London',
    country: 'United Kingdom',
  },
  CDG: {
    code: 'CDG',
    name: 'Charles de Gaulle Airport',
    city: 'Paris',
    country: 'France',
  },
  NRT: {
    code: 'NRT',
    name: 'Narita International Airport',
    city: 'Tokyo',
    country: 'Japan',
  },
  SYD: {
    code: 'SYD',
    name: 'Sydney Kingsford Smith Airport',
    city: 'Sydney',
    country: 'Australia',
  },
  DXB: {
    code: 'DXB',
    name: 'Dubai International Airport',
    city: 'Dubai',
    country: 'United Arab Emirates',
  },
  SIN: {
    code: 'SIN',
    name: 'Singapore Changi Airport',
    city: 'Singapore',
    country: 'Singapore',
  },
  ORD: {
    code: 'ORD',
    name: "O'Hare International Airport",
    city: 'Chicago',
    country: 'United States',
  },
  MIA: {
    code: 'MIA',
    name: 'Miami International Airport',
    city: 'Miami',
    country: 'United States',
  },
};

// Mock airlines
const airlines = ['AA', 'DL', 'UA', 'BA', 'AF', 'LH', 'JL', 'SQ', 'EK', 'QF'];

// Helper function to generate random date
const getRandomDate = (daysFromNow: number, hourRange: [number, number] = [6, 22]) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  const randomHour = Math.floor(Math.random() * (hourRange[1] - hourRange[0])) + hourRange[0];
  const randomMinute = Math.floor(Math.random() * 60);
  date.setHours(randomHour, randomMinute, 0, 0);
  return date.toISOString();
};

// Helper function to add minutes to a date
const addMinutes = (dateString: string, minutes: number) => {
  const date = new Date(dateString);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
};

// Generate mock flights
export const generateMockFlights = (): Flight[] => {
  const flights: Flight[] = [];
  const routes = [
    ['JFK', 'LAX'],
    ['JFK', 'LHR'],
    ['LAX', 'NRT'],
    ['LHR', 'CDG'],
    ['JFK', 'MIA'],
    ['ORD', 'LAX'],
    ['LAX', 'SYD'],
    ['LHR', 'DXB'],
    ['CDG', 'SIN'],
    ['NRT', 'SYD'],
  ];

  let flightId = 1;

  routes.forEach(([originCode, destCode]) => {
    const origin = airports[originCode];
    const destination = airports[destCode];

    // Generate 2-4 flights per route
    const flightsPerRoute = Math.floor(Math.random() * 3) + 2;
    
    for (let i = 0; i < flightsPerRoute; i++) {
      const stops = Math.random() < 0.5 ? 0 : Math.random() < 0.7 ? 1 : Math.random() < 0.9 ? 2 : 3;
      const basePrice = Math.floor(Math.random() * 1500) + 200;
      const priceMultiplier = stops === 0 ? 1.2 : stops === 1 ? 1.0 : stops === 2 ? 0.8 : 0.7;
      const durationBase = Math.floor(Math.random() * 480) + 120; // 2-10 hours base
      const durationWithStops = durationBase + (stops * 90); // Add 1.5h per stop
      
      const departAt = getRandomDate(Math.floor(Math.random() * 30) + 1);
      const arriveAt = addMinutes(departAt, durationWithStops);
      
      const selectedAirlines = stops === 0 
        ? [airlines[Math.floor(Math.random() * airlines.length)]]
        : airlines.slice(0, Math.floor(Math.random() * Math.min(stops + 1, 3)) + 1);

      flights.push({
        id: `FL${flightId.toString().padStart(4, '0')}`,
        priceTotal: Math.floor(basePrice * priceMultiplier),
        currency: 'USD',
        airlineCodes: selectedAirlines,
        stops,
        durationMinutes: durationWithStops,
        departAt,
        arriveAt,
        origin,
        destination,
      });

      flightId++;
    }
  });

  // Add some return flights (reverse routes)
  const returnFlights = flights.slice(0, 10).map((flight, index) => ({
    ...flight,
    id: `FL${(flightId + index).toString().padStart(4, '0')}`,
    origin: flight.destination,
    destination: flight.origin,
    departAt: getRandomDate(Math.floor(Math.random() * 30) + 5),
    arriveAt: addMinutes(getRandomDate(Math.floor(Math.random() * 30) + 5), flight.durationMinutes),
    priceTotal: flight.priceTotal + Math.floor(Math.random() * 200) - 100,
  }));

  return [...flights, ...returnFlights];
};

// Static mock flights for consistent development
export const mockFlights: Flight[] = generateMockFlights();