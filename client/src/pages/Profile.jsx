import {useSelector} from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase';
import { updateUserStart, updateUserFailure, updateUserSuccess, 
  deleteUserFailure, deleteUserStart, deleteUserSuccess,
signInFailure, signInStart, signInSuccess, 
signOutUserStart,
signOutUserFailure,
signOutUserSuccess} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import {Link} from 'react-router-dom';
import { Button, TextInput } from 'flowbite-react';

export default function Profile() {
  const fileRef = useRef(null);
  const {currentUser, loading, error} = useSelector(state => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();
 
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app); //initialize storage
    const fileName = new Date().getTime() + file.name; //set unique fileName o uer can upload same image twice 
    const storageRef = ref(storage, fileName); //storage reference, no folder
    const uploadTask = uploadBytesResumable(storageRef,file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },

      (error) => {
        setFileUploadError(true);
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then (
          (downloadURL) => setFormData({...formData, avatar: downloadURL})
        );
      }
    );
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch (`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch (`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',

      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));

    } catch(error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

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

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch(error) {
      setShowListingsError(true);
    }
  }

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch(error) {
      console.log(error.message);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4' >
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover
        cursor-pointer  self-center mt-2' />
        <p className='text-sm self-center'>
          {
            fileUploadError ? <span className='text-red-700'>Error Image Upload (image must be less than 10mb)</span>
            : filePerc > 0 && filePerc < 100 ? (
              <span className='text-slate-700'>
                {`Uploading... ${filePerc}%`}
              </span>
            ) : filePerc === 100 ? <span className='text-green-700'>Successfully uploaded!</span>
            : ""
          }
        </p>
        <TextInput  onChange={handleChange} defaultValue={currentUser.username} type="text" placeholder='username'  id="username" />
        <TextInput onChange={handleChange} defaultValue={currentUser.email} type="email" placeholder='email'  id="email" />
        <TextInput  onChange={handleChange} type="password" placeholder='password'  id='password' />
        <Button type='submit' disabled={loading} 
          gradientDuoTone={'purpleToBlue'}
          outline
        >
          {
            loading ? 'Loading...' : 'Update'
          }
         </Button>
         <Link  to={'/create-listing'}>
            <Button type='button' gradientDuoTone={'purpleToPink'}
             className='w-full'>
                Create Listing
            </Button>
         </Link>
      </form>
      <div className="flex flex-row justify-between mt-5">
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>
        {error ? error : ''}
      </p>
      <p className='text-green-700'>
          {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
      <button onClick={handleShowListings} className=' w-full'>Show Listings</button>
      <p className='text-red-700 mt-5'>
        {
          showListingsError ? 'Error showing lisstings': ''
        }
      </p>
      {
        userListings && userListings.length > 0  && 
        <div className="flex flex-col gap-4">
          <h1 className='text-center mt-7 text-2xl 
          font-semibold'>Your Listings</h1>
          {userListings.map((listing) => (
            <div key={listing._id} className="flex border rounded-lg p-3 justify-between 
            items-center gap-4">
              <Link to={`/listing/${listing._id}`}>
                <img className='h-16 w-16 object-contain' src={listing.imageUrls[0]} alt="listing cover" />
              </Link>
              <Link className='font-semibold flex-1 
                hover:underline truncate' to={`/listing/${listing._id}`}>
                <p >{listing.name}</p>
              </Link>
              <div className="flex flex-col item">
                <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  )
}
