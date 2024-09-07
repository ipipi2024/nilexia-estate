import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectFade, Autoplay } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const navigate =useNavigate();
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        log(error);
      }
    };
    fetchOfferListings();

  }, []);
  return (
    <div>
       {/* top */}
       <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className=' font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-purple-600'>perfect</span>
          <br />
          place with ease
        </h1>
        <div className='text-gray-500 text-xs sm:text-sm'>
          Nilexia is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm  font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>
        {/* Swiper Slider */}
      <Swiper
        navigation
        effect="fade"
        modules={[EffectFade, Autoplay]}
        autoplay={{ delay: 3000 }}
        slidesPerView={1}
        pagination={{ type: "progressbar" }}
      >
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id} onClick={() => navigate(`/listing/${listing._id}`)}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='relative h-[500px]'
              >
                <p className="text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] shadow-lg opacity-90 p-2 rounded-br-3xl">
                {listing.name}
              </p>
              <p className="text-[#f1faee] absolute left-1 bottom-1 font-semibold max-w-[90%] bg-[#e63946] shadow-lg opacity-90 p-2 rounded-tr-3xl">
                ${listing.discountedPrice ?? listing.regularPrice}
                {listing.type === "rent" && " / month"}
              </p>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
        {/* listing results for offer, sale and rent */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
            <div className=''>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold mb-5'>Recent offers</h2>
                <Link className='text-sm hover:underline' to={'/search?offer=true'}>Show more offers...</Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {offerListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
            {rentListings && rentListings.length > 0 && (
            <div className=''>
              <div className='my-3'>
                <h2 className='text-2xl mb-5 font-semibold'>Recent places for rent</h2>
                <Link className='text-sm hover:underline' to={'/search?type=rent'}>Show more places for rent...</Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {rentListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
            {saleListings && saleListings.length > 0 && (
            <div className=''>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold mb-5 '>Recent places for sale</h2>
                <Link className='text-sm hover:underline' to={'/search?type=sale'}>Show more places for sale...</Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {saleListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  )
}
