import React, { useState } from 'react';
import { Calendar, Plane, Search, Clock, User, Globe, Menu, ChevronLeft, ChevronRight } from 'lucide-react';

interface Flight {
  id: number;
  airline: string;
  price: number;
  departTime: string;
  arriveTime: string;
  duration: string;
  stops: number;
  isDirect: boolean;
  color: string;
}

const flights: Flight[] = [
  { id: 1, airline: 'HorizonJet', price: 275.5, departTime: '10:25PM', arriveTime: '7:06AM', duration: '10h 41min', stops: 1, isDirect: false, color: '#4DB8AC' },
  { id: 2, airline: 'Altitude Airways', price: 206, departTime: '6:30AM', arriveTime: '7:55AM', duration: '3h 25min', stops: 1, isDirect: false, color: '#FF9933' },
  { id: 3, airline: 'Cloudy Airlines', price: 148.5, departTime: '1:19 PM', arriveTime: '2:45 PM', duration: '3h 26min', stops: 1, isDirect: false, color: '#3B82F6' },
  { id: 4, airline: 'Cloudy Airlines', price: 380.15, departTime: '6:13 PM', arriveTime: '7:40 PM', duration: '3h 27min', stops: 1, isDirect: false, color: '#3B82F6' },
  { id: 5, airline: 'Altitude Airways', price: 269.10, departTime: '6:20AM', arriveTime: '7:46AM', duration: '3h 28min', stops: 2, isDirect: false, color: '#FF9933' },
  { id: 6, airline: 'HorizonJet', price: 549.10, departTime: '7:15PM', arriveTime: '8:45 PM', duration: '3h 30min', stops: 0, isDirect: true, color: '#4DB8AC' },
  { id: 7, airline: 'HorizonJet', price: 200.5, departTime: '6:01AM', arriveTime: '7:28AM', duration: '3h 27min', stops: 0, isDirect: true, color: '#4DB8AC' },
  { id: 8, airline: 'FlyScape', price: 549.10, departTime: '8:40AM', arriveTime: '10:00AM', duration: '3h 20min', stops: 0, isDirect: true, color: '#EF4444' },
];

const dates = [
  { day: 'Fri, 16 Feb', price: 148 },
  { day: 'Sat, 17 Feb', price: 160 },
  { day: 'Sun, 18 Feb', price: 170.8 },
  { day: 'Mon, 19 Feb', price: 195 },
  { day: 'Tue, 20 Feb', price: 146.5 },
];

export default function FlightBookingUI() {
  const [priceSort, setPriceSort] = useState('lowest');
  const [selectedDate, setSelectedDate] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plane className="w-8 h-8 text-teal-500" />
              <span className="text-xl font-bold text-teal-500">E-flight</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden md:block text-gray-700">USD</span>
              <button className="hidden md:block">
                <Globe className="w-5 h-5 text-gray-700" />
              </button>
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <button className="md:hidden">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-teal-800 to-teal-600 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 relative">
          <div className="relative z-10">
            <h1 className="text-white text-4xl md:text-6xl font-bold">
              Explore <span className="text-yellow-400">your</span>
            </h1>
            <h2 className="text-yellow-400 text-5xl md:text-8xl font-black leading-tight">
              World
            </h2>
            <p className="text-white text-2xl md:text-4xl italic">Special Offer</p>
          </div>
          <div className="absolute top-4 right-4 bg-yellow-400 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold text-sm md:text-xl">
            UP TO 50% OFF
          </div>
          {/* Decorative dots */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 grid grid-cols-3 gap-2 opacity-30">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 pb-12 relative z-20">
        {/* Search Card */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500" />
              <input
                type="text"
                placeholder="Houston (HOU)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500 rotate-90" />
              <input
                type="text"
                placeholder="Los Angeles (LAX)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500" />
              <input
                type="text"
                placeholder="9/12/2023 - 12/2/2023"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              <span className="md:hidden">Search</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Sort by</h3>
                <button className="text-teal-500 text-sm">Reset</button>
              </div>
              
              <div className="mb-6">
                <p className="font-semibold mb-2">Price</p>
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    checked={priceSort === 'lowest'}
                    onChange={() => setPriceSort('lowest')}
                    className="w-4 h-4 text-teal-500"
                  />
                  <span className="text-sm">Lowest price</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={priceSort === 'highest'}
                    onChange={() => setPriceSort('highest')}
                    className="w-4 h-4 text-teal-500"
                  />
                  <span className="text-sm">Highest price</span>
                </label>
              </div>

              <hr className="my-6" />

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Filters</h3>
                <button className="text-teal-500 text-sm">Reset</button>
              </div>

              <div className="mb-6">
                <p className="font-semibold mb-2">No. of transit</p>
                <label className="flex items-center gap-2 mb-2">
                  <input type="checkbox" className="w-4 h-4 text-teal-500 rounded" />
                  <span className="text-sm">Direct (30 USD)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-teal-500 rounded" />
                  <span className="text-sm">1 transit (45 USD)</span>
                </label>
              </div>

              <hr className="my-6" />

              <div className="mb-6">
                <p className="font-semibold mb-2">Transit point</p>
                <label className="flex items-center gap-2 mb-2">
                  <input type="checkbox" className="w-4 h-4 text-teal-500 rounded" />
                  <span className="text-sm">Osaka (ITM)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-teal-500 rounded" />
                  <span className="text-sm">Kuala Lumpur (KUL)</span>
                </label>
              </div>

              <hr className="my-6" />

              <div>
                <p className="font-semibold mb-3">Transit duration</p>
                <input
                  type="range"
                  min="0"
                  max="22"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0h</span>
                  <span>22h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Flight Results */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full bg-teal-500 text-white py-3 rounded-lg mb-4 font-semibold"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            {/* Date Selector */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {dates.map((date, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(idx)}
                  className={`min-w-[140px] flex-shrink-0 py-3 px-4 rounded-lg border-2 transition ${
                    selectedDate === idx
                      ? 'bg-teal-500 border-teal-500 text-white'
                      : 'bg-white border-teal-500 text-teal-500 hover:bg-teal-50'
                  }`}
                >
                  <div className="font-semibold text-sm">{date.day}</div>
                  <div className="text-xs mt-1">{date.price} USD</div>
                </button>
              ))}
            </div>

            {/* Price Notice */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-10 bg-teal-500 rounded"></div>
              <p className="text-sm text-gray-600">Prices are currently typical</p>
            </div>

            {/* Flight Cards */}
            {flights.map((flight) => (
              <div key={flight.id} className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-2 flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: flight.color }}
                    >
                      <Plane className="w-6 h-6 text-white" />
                    </div>
                    <div className="md:hidden">
                      <p className="font-semibold">{flight.airline}</p>
                      <p className="text-xs text-gray-500">23kg</p>
                    </div>
                  </div>
                  <div className="md:col-span-2 hidden md:block">
                    <p className="font-semibold">{flight.airline}</p>
                    <p className="text-xs text-gray-500">23kg</p>
                  </div>
                  <div className="md:col-span-3">
                    <p className="font-bold text-lg">
                      {flight.departTime} - {flight.arriveTime}
                    </p>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{flight.duration}</span>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {flight.isDirect ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                    </span>
                  </div>
                  <div className="md:col-span-3 flex flex-col items-end">
                    <p className="text-2xl font-bold text-orange-500">{flight.price} USD</p>
                    <p className="text-xs text-gray-500 mb-2">/ pax</p>
                    <button className="border-2 border-teal-500 text-teal-500 hover:bg-teal-50 px-6 py-2 rounded-lg font-semibold transition">
                      Choose
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-6">
              <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50">
                <ChevronLeft className="w-5 h-5" />
              </button>
              {[1, 2, 3, 4, '...', 10, 11].map((page, idx) => (
                <button
                  key={idx}
                  className={`w-10 h-10 rounded-lg font-semibold transition ${
                    page === 1
                      ? 'bg-teal-500 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Plane className="w-8 h-8 text-teal-500" />
                <span className="text-xl font-bold text-teal-500">E-flight</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Input your email"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  Subscribe
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3">About us</h4>
              <p className="text-sm text-gray-600 mb-2">How to book</p>
              <p className="text-sm text-gray-600">Help center</p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Flight</h4>
              <p className="text-sm text-gray-600 mb-2">Booking easily</p>
              <p className="text-sm text-gray-600">Promotions</p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Contact us</h4>
              <div className="flex gap-3">
                <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                  <span className="text-xl">f</span>
                </button>
                <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                  <span className="text-xl">𝕏</span>
                </button>
                <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                  <span className="text-xl">📷</span>
                </button>
              </div>
            </div>
          </div>
          <hr className="my-6" />
          <p className="text-center text-xs text-gray-500">
            © 2022 Company, Inc. • Privacy • Terms
          </p>
        </div>
      </footer>
    </div>
  );
}