import { Button } from 'flowbite-react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const params = useParams();
  const navigate = useNavigate();

  function onChange(e) {
    setNewPassword(e.target.value);
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch(`/api/user/reset-password/${params.resetToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });

      if (response.ok) {
        toast.success('Password has been reset!');
        navigate('/sign-in');
      } else {
        toast.error('Failed to reset password');
      }
    } catch (error) {
      toast.error('Failed to reset password');
    }
  }

  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold">Reset Password</h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form className="flex flex-col" onSubmit={onSubmit}>
            <input
              type="password"
              value={newPassword}
              onChange={onChange}
              placeholder="Enter your new password"
              required
              className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
            />
            <Button
              gradientDuoTone={'purpleToBlue'}
              outline
              type="submit"
            >
              Reset Password
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
