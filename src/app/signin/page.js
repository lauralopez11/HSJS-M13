'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Input, Button, Link } from "@nextui-org/react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";
import { AlertCircle } from "lucide-react"



export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMessage('');
    setIsLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        console.log(res);
        setAlertMessage('Invalid email or password');
      } else {
        router.push('/');
      }
    } catch (error) {
      console.log(error);
      setAlertMessage('An error occurred during signin. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full max-w-sm p-5 border rounded-lg shadow-md"
      >
        <h1 className="text-3xl font-bold mb-4">Sign in</h1>

        {alertMessage && (
          <Alert variant="destructive" className="mb-5 shadow bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}

        <Input
          className="max-w-xs mb-3"
          type="email"
          label="Email"
          variant="bordered"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          type={isPasswordVisible ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          className="w-full mt-3 font-semibold"
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>

        <div className="mt-4 text-center">
          <span className="text-sm text-default-500">
            Don&apos;t have an account?
            <Link href="/signup" className="ml-2 text-blue-500 hover:underline">
              Create an account
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}
