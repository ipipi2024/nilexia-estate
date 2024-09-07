
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
export default function ListingItem({ listing }) {
  // Calculate the time difference in a human-readable format
  const calculateTimeAgo = (createdAt) => {
    const listingDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate - listingDate; // Difference in milliseconds

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (seconds < 60) {
      return seconds === 1 ? 'Listed 1 second ago' : `Listed ${seconds} seconds ago`;
    } else if (minutes < 60) {
      return minutes === 1 ? 'Listed 1 minute ago' : `Listed ${minutes} minutes ago`;
    } else if (hours < 24) {
      return hours === 1 ? 'Listed 1 hour ago' : `Listed ${hours} hours ago`;
    } else if (days < 30) {
      return days === 1 ? 'Listed 1 day ago' : `Listed ${days} days ago`;
    } else if (months < 12) {
      return months === 1 ? 'Listed 1 month ago' : `Listed ${months} months ago`;
    } else {
      return years === 1 ? 'Listed 1 year ago' : `Listed ${years} years ago`;
    }
  };

  return (
    <div className='group relative w-full border border-teal-500 hover:border-2 overflow-hidden rounded-lg sm:w-[330px] transition-all' >
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] ||
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt='listing cover'
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
        {/* Display the time since the listing was created */}
        <div className='absolute top-2 left-2 bg-white text-black px-2 py-1 rounded-md text-xs shadow-md'>
            {calculateTimeAgo(listing.createdAt)}
          </div>
       
        <div className='p-3 flex flex-col gap-2 w-full'>
          <p className='truncate text-lg font-semibold'>
            {listing.name}
          </p>
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 text-green-700' />
            <p className='text-sm  truncate w-full'>
              {listing.address}
            </p>
          </div>
          <p className='text-sm line-clamp-2'>
            {listing.description}
          </p>
          <p className=' mt-2 font-semibold '>
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString('en-US')
              : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'}
          </p>
          <div className=' flex gap-4'>
            <div className='font-bold text-xs'>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds `
                : `${listing.bedrooms} bed `}
            </div>
            <div className='font-bold text-xs'>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths `
                : `${listing.bathrooms} bath `}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
