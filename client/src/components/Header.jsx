import { FaMoon, FaSun, FaSearch } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signOutUserFailure,signOutUserStart, signOutUserSuccess } from '../redux/user/userSlice';

export default function Header() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const {theme} = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNavbarOpen, setIsNavbarOpen] = useState(false); // State to manage navbar collapse
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = res.json();
      if(data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));

    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  return (
    <Navbar className='border-b-2'>
      <Link
        to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
      >
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
          Nilexia
        </span>
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type='text'
          placeholder='Search...'
          className='hidden lg:inline'
          rightIcon={AiOutlineSearch}
        />
      </form>
      <Link to={'/search'}>
        <Button className='w-12 h-10 lg:hidden' color='gray' pill>
          <AiOutlineSearch />
        </Button>
      </Link>
      <div className='flex gap-2 md:order-2'>
        <Button className='w-12 h-10 sm:inline' color='gray' pill
        onClick={() => dispatch(toggleTheme())}>
          {theme === 'light' ? <FaMoon/> : <FaSun/>}
        </Button>
        {currentUser ? (
          <Dropdown arrowIcon={false} inline 
          label={<Avatar alt='user' img={currentUser.avatar} rounded/>}>
            <Dropdown.Header>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider/>
            <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
          </Dropdown>
        ): (
          <Link to={'/sign-in'}>
            <Button outline gradientDuoTone={'purpleToBlue'} >
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle/>
      </div>
        <Navbar.Collapse>
          <Navbar.Link active={path === '/'} as={'div'}>
            <Link to='/'>
              Home
            </Link>
          </Navbar.Link>
          <Navbar.Link active={path === '/about'} as={'div'}>
            <Link to='/about'>
              About
            </Link>
          </Navbar.Link>
        </Navbar.Collapse>
    </Navbar>
  );
}
