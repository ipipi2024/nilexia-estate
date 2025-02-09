import React from 'react'
import DashSidebar from '../components/DashSidebar'
import DashProfile from '../components/DashProfile'
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashListings from '../components/DashListings';

export default function () {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile... */}
      {tab === 'profile' && <DashProfile />}
      {/* listing */}
      {tab === 'listings' && <DashListings/>}
    </div>
  )
}
