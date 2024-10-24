import { useState } from 'react';
import searchIcon from '../assets/search.svg'; // Assuming this is your search icon


const states = [
  'Abuja', 'Abia', 'Adamawa', 'Akwa-Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross-River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',  'FCT', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara',
];

const markets = {
  Lagos: [
    { name: 'Agbalata Market Badagry', img: '/path/to/agbalata.png' },
    { name: 'Alaba International Market', img: '/path/to/alaba-international.png' },
    { name: 'Ajah Market', img: '/path/to/ajah-market.png' },
    { name: 'Aratumi Market', img: '/path/to/aratumi-market.png' },
    { name: 'Balogun Market, Lagos Island', img: '/path/to/balogun.png' },
    { name: 'Bar Beach Market', img: '/path/to/bar-beach-market.png' },
    { name: 'Computer Village', img: '/path/to/computer-village.png' },
    { name: 'Èbúté Èrò Market, Lagos Island', img: '/path/to/ebutero-market.png' },
    { name: 'Epe Fish Market', img: '/path/to/epe-fish-market.png' },
    { name: 'Iyana-Iba Market', img: '/path/to/iyana-iba-market.png' },
    { name: 'Ikotun Market', img: '/path/to/ikotun-market.png' },
    { name: 'Idumota Market', img: '/path/to/idumota-market.png' },
    { name: 'Ita Faji Market', img: '/path/to/ita-faji-market.png' },
    { name: 'Isale Eko Market, Lagos Island', img: '/path/to/isale-eko-market.png' },
    { name: 'Jankarra Market, Lagos Island', img: '/path/to/jankarra-market.png' },
    { name: 'Ladipo Market', img: '/path/to/ladipo-market.png' },
    { name: 'Lekki Market', img: '/path/to/lekki-market.png' },
    { name: 'Agboju Market', img: '/path/to/agboju-market.png' },
    { name: 'Daleko Market', img: '/path/to/daleko-market.png' },
    { name: 'Morocco I and II markets', img: '/path/to/morocco-markets.png' },
    { name: 'Mushin Market', img: '/path/to/mushin-market.png' },
    { name: 'Oyingbo Market', img: '/path/to/oyingbo-market.png' },
    { name: 'Mile 12 Market', img: '/path/to/mile12-market.png' },
    { name: 'Oniru New Market', img: '/path/to/oniru-new-market.png' },
    { name: 'Fespar Market', img: '/path/to/fespar-market.png' },
    { name: 'Oshodi Market', img: '/path/to/oshodi-market.png' },
    { name: 'Rauf Aregbesola Market', img: '/path/to/rauf-aregbesola-market.png' },
    { name: 'Téjúoshó Market', img: '/path/to/tejushosho-market.png' },
    { name: 'Sangotedo Market', img: '/path/to/sangotedo-market.png' },
    { name: 'Ajuwe Market', img: '/path/to/ajuwe-market.png' },
    { name: 'Jakande Market', img: '/path/to/jakande-market.png' },
    { name: 'Akodo Market, Epe', img: '/path/to/akodo-market.png' },
    { name: 'Boundary Seafood Market', img: '/path/to/boundary-seafood-market.png' },
    { name: 'Apongbo Market', img: '/path/to/apongbo-market.png' },
    { name: 'Liverpool Crayfish Market', img: '/path/to/liverpool-crayfish-market.png' },
    { name: 'Arena Market', img: '/path/to/arena-market.png' },
    { name: 'Cele Market', img: '/path/to/cele-market.png' },
    { name: 'Ijesha Market, Ijeshatedo', img: '/path/to/ijesha-market.png' },
    { name: 'State Market', img: '/path/to/state-market.png' },
    { name: 'Agege Market', img: '/path/to/agege-market.png' },
  ],
   
  Abia:[
    { name: 'Ariaria International Market (Aba)', img: '/path/to/ariaria.png' },
    { name: 'Umuahia Main Market (Umuahia)', img: '/path/to/umuahia-main.png' },
    { name: 'Ubakala Market (Ubakala)', img: '/path/to/ubakala.png' },
    { name: 'Aba International Market (Aba)', img: '/path/to/aba-international.png' },
    { name: 'Ohia Market (Ohia)', img: '/path/to/ohia.png' },
    { name: 'Osisioma Market (Osisioma)', img: '/path/to/osisioma.png' },
    { name: 'Omoba Market (Omoba)', img: '/path/to/omoba.png' },
    { name: 'Isiala Oboro Market (Isiala Oboro)', img: '/path/to/isiala-oboro.png' },
    { name: 'Umuike Market (Umuike)', img: '/path/to/umuike.png' },
    { name: 'Akwa Ibom Market (Aba)', img: '/path/to/akwa-ibom.png' },
    { name: 'Eziukwu Market (Aba)', img: '/path/to/eziukwu.png' },
    { name: 'Ogbuka Market (Umuahia)', img: '/path/to/ogbuka.png' },
    { name: 'Olokoro Market (Olokoro)', img: '/path/to/olokoro.png' },
    { name: 'Ikwuano Market (Ikwuano)', img: '/path/to/ikwuano.png' },
    { name: 'Okeikpe Market (Okeikpe)', img: '/path/to/okeikpe.png' },
    { name: 'Uzuakoli Market (Uzuakoli)', img: '/path/to/uzuakoli.png' },
    { name: 'Alaoji Market (Alaoji)', img: '/path/to/alaoji.png' },
    { name: 'Obikabia Market (Obikabia)', img: '/path/to/obikabia.png' },
    { name: 'Umuocham Market (Umuocham)', img: '/path/to/umuocham.png' },
    { name: 'Nkwoegwu Market (Nkwoegwu)', img: '/path/to/nkwoegwu.png' },
    { name: 'Umuosu Market (Umuosu)', img: '/path/to/umuosu.png' },
    { name: 'Oriendu Market (Oriendu)', img: '/path/to/oriendu.png' },
    { name: 'Ndiegoro Market (Ndiegoro)', img: '/path/to/ndiegoro.png' },
]
  // Add markets for other states
};

const MarketPage = () => {
  const [selectedState, setSelectedState] = useState('Lagos');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMarkets = markets[selectedState]?.filter((market) =>
    market.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-white text-green py-2 drop-shadow-sm">
        <div className="container mx-auto flex justify-between items-center px-4">
          
          {/* Left Section with Markets and Malls */}
          <div className='flex items-center space-x-4'>
            <div className="text-lg font-semibold">
              Markets
            </div>
            <div className="text-lg font-semibold">
              Malls
            </div>
          </div>
          
          {/* Center Section - Search Bar */}
          <div className="flex-grow flex justify-center">
            <div className="flex items-center bg-white border border-green text-gray-600 rounded-full px-4 py-2 w-full max-w-md focus:ring-green focus:ring-opacity-50">
              <input
                type="text"
                placeholder={`Search ${selectedState} markets...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full outline-none text-sm px-2"
              />
              <img src={searchIcon} alt="Search" className="h-5 w-5" />
            </div>
            
          </div>
          
          {/* Empty Right Side (Optional for now) */}
          <div className='flex items-center space-x-4'></div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-grow">
        {/* Sidebar: List of States */}
        <div className="w-1/4 bg-white p-6">
          <ul className="space-y-2">
            {states.map((state) => (
              <li
                key={state}
                onClick={() => setSelectedState(state)}
                className={`cursor-pointer p-2 ${
                  selectedState === state ? 'bg-green text-white' : 'text-gray-800'
                } hover:bg-green hover:opacity-75 hover:text-white rounded-lg focus:font-semibold`}
              >
                {state}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content: Markets */}
        <div className="w-3/4 bg-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{selectedState} State Markets</h2>
          </div>

          {/* Market Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMarkets.length > 0 ? (
              filteredMarkets.map((market, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={market.img}
                    alt={market.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{market.name}</h3>
                    <a
                      href="#"
                      className="text-green text-sm hover:underline mt-2 block"
                    >
                      View more
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p>No markets found for "{searchTerm}"</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPage;
