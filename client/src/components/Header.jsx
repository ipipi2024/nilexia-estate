import { FaMoon, FaSun, FaSearch } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { toggleTheme } from '../redux/theme/themeSlice';

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

  return (
    <Navbar className='border-b-2'>
      <Link
        to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
      >
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
          Nilexia
        </span>
        Estate
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
        <Button className='w-12 h-10 lg:hidden' color='gray' pill>
          <AiOutlineSearch />
        </Button>
      <div className='flex gap-2 md:order-2'>
        <Button className='w-12 h-10 hidden sm:inline' color='gray' pill
        onClick={() => dispatch(toggleTheme())}>
          {theme === 'light' ? <FaSun/> : <FaMoon/>}
        </Button>
        {/* Toggle button to show/hide the navbar collapse */}
        <Navbar.Toggle onClick={() => setIsNavbarOpen(!isNavbarOpen)} />
        <Link to='/sign-in'>
          <Button  outline gradientDuoTone='purpleToBlue'>
            Sign In
          </Button>
        </Link>
      </div>
      {/* Conditionally render Navbar.Collapse based on state */}
      {isNavbarOpen && (
        <Navbar.Collapse className='flex gap-4'>
          <Navbar.Link active={path === '/'} as={'div'}>
            <Link to='/'>
              <li>Home</li>
            </Link>
          </Navbar.Link>
          <Navbar.Link active={path === '/about'} as={'div'}>
            <Link to='/about'>
              <li>About</li>
            </Link>
          </Navbar.Link>

          <Link to='/profile'>
            {currentUser ? (
              <img
                className='rounded-full h-7 w-7 object-cover'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              <></>
            )}
          </Link>
        </Navbar.Collapse>
      )}
    </Navbar>
  );
}
