'use client';

import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import signIn from '../firebase/auth/signin';
import { Footer } from '../templates/Footer';
import { Hero } from '../templates/Hero';

function Page(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const toast = useToast();

  // Handle form submission
  const handleForm = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    // Attempt to sign in with provided email and password
    const { result, error } = await signIn(email, password);

    if (error) {
      // Display and log any sign-in errors
      toast({
        title: 'Something Went Wrong',
        description: 'Please contact us if this keeps on happening',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      console.log(error);
      return;
    }

    // Sign in successful
    console.log(result);

    // Redirect to the admin page
    // Typically you would want to redirect them to a protected page an add a check to see if they are admin or
    // create a new page for admin
    router.push('/');
  };

  return (
    <>
      <Hero />
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="w-full max-w-xs">
          <form
            onSubmit={handleForm}
            className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md"
          >
            <h1 className="mb-6 text-3xl font-bold text-black">Sign In</h1>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                name="email"
                id="email"
                placeholder="example@mail.com"
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                name="password"
                id="password"
                placeholder="password"
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="w-full rounded bg-blue-500 py-2 font-semibold text-white"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
        <a href="/signup">Don&lsquo;t Have an Account? Sign Up</a>
      </div>
      <Footer />
    </>
  );
}

export default Page;
