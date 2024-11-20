'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Input, Button, Link } from "@nextui-org/react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";
import { AlertCircle } from "lucide-react";
import { signIn } from 'next-auth/react';
import { useMutation } from 'react-query';
import axios from 'axios';

const signUpUser = async ({ username, email, password }) => {
  const { data } = await axios.post('/api/auth/signup', {
    username,
    email,
    password,
  });
  return data;
};

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const router = useRouter();

  const { mutate: register, isLoading, error } = useMutation(signUpUser, {
    onSuccess: async () => {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setFormErrors({ message: 'An error occurred during signin. Please try again.' });
      } else {
        router.push('/');
      }
    },
    onError: (error) => {
      if (error?.response?.data) {
        setFormErrors(error.response.data);
      } else {
        setFormErrors({ message: 'Something went wrong. Please try again later.' });
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors({});
    register({ username, email, password });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full max-w-sm p-5 border rounded-lg shadow-md"
      >
        <h1 className="text-3xl font-bold mb-8">Create an Account</h1>

        {formErrors.general && (
          <Alert variant="destructive" className="mb-5 shadow bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{formErrors.general}</AlertDescription>
          </Alert>
        )}

        <Input
          className="max-w-xs mb-3"
          type="text"
          label="Username"
          variant="bordered"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setFormErrors((prevErrors) => ({ ...prevErrors, username: undefined }));
          }}
          isInvalid={Boolean(formErrors?.username)}
          errorMessage={formErrors?.username}
          required
        />

        <Input
          className="max-w-xs mb-3"
          type="email"
          label="Email"
          variant="bordered"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setFormErrors((prevErrors) => ({ ...prevErrors, email: undefined }));
          }}
          isInvalid={Boolean(formErrors?.email)}
          errorMessage={formErrors?.email}
          required
        />

        <Input
          className="max-w-xs mb-3"
          label="Password"
          variant="bordered"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={() => setIsPasswordVisible((v) => !v)}
              aria-label="toggle password visibility"
            >
              {isPasswordVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          onFocusChange={(f) => !f && setIsPasswordVisible(false)}
          type={isPasswordVisible ? "text" : "password"}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setFormErrors((prevErrors) => ({ ...prevErrors, password: undefined }));
          }}
          isInvalid={Boolean(formErrors?.password)}
          errorMessage={formErrors?.password}
          required
        />


        <Button
          className="w-full mt-3 font-semibold"
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <div className="mt-4 text-center">
          <span className="text-sm text-default-500">
            Already have an account?
            <Link href="/signin" className="ml-2 text-blue-500 hover:underline">
              Sign in
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}
