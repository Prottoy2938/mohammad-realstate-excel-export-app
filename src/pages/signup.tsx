'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import signUp from '../firebase/auth/signup';
import { Hero } from '../templates/Hero';

function Page(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // Handle form submission
  const handleForm = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    // Attempt to sign up with provided email and password
    const { result, error } = await signUp(email, password);

    if (error) {
      // Display and log any sign-up errors
      console.log(error);
      return;
    }

    // Sign up successful
    console.log(result);

    // Redirect to the admin page
    router.push('/');
  };

  return (
    <>
      <Hero />

    <div className="flex h-screen items-center justify-center text-black">
      <div className="w-96 rounded bg-white p-6 shadow">
        <h1 className="mb-6 text-3xl font-bold">Registration</h1>
        <form onSubmit={handleForm} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block font-medium">
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              name="email"
              id="email"
              placeholder="example@mail.com"
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block font-medium">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              name="password"
              id="password"
              placeholder="password"
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-blue-500 py-2 font-semibold text-white"
          >
            Sign up
          </button>
        </form>
        <a href="/signin" style={{ marginTop: '15px' }}>
          Have an Account? Sign In
        </a>
      </div>
    </div>
    </>
  );
}

export default Page;
