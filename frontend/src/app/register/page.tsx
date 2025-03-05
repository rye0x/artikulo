'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuth } from '@/context/auth-context';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RegisterCredentials } from '@/lib/api';

export default function RegisterPage() {
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);





































































































}  );    </div>      </Card>        </CardFooter>          </div>            </Link>              Log in            <Link href="/login" className="text-primary font-medium hover:underline">            Already have an account?{' '}          <div className="text-sm text-center">        <CardFooter className="flex justify-center">        </CardContent>          </form>            </Button>              {isLoading ? 'Creating account...' : 'Register'}            >              disabled={isLoading}              className="w-full"               type="submit"             <Button             </div>              />                minLength={6}                required                onChange={handleChange}                value={credentials.password}                type="password"                name="password"                id="password"              <Input              </label>                Password              <label htmlFor="password" className="text-sm font-medium">            <div className="space-y-2">            </div>              />                required                onChange={handleChange}                value={credentials.email}                type="email"                name="email"                id="email"              <Input              </label>                Email              <label htmlFor="email" className="text-sm font-medium">            <div className="space-y-2">            </div>              />                required                onChange={handleChange}                value={credentials.username}                type="text"                name="username"                id="username"              <Input              </label>                Username              <label htmlFor="username" className="text-sm font-medium">            <div className="space-y-2">          <form onSubmit={handleSubmit} className="space-y-4">          )}            </Alert>              <AlertDescription>{error}</AlertDescription>            <Alert variant="destructive" className="mb-4">          {error && (        <CardContent>        </CardHeader>          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>        <CardHeader>      <Card className="w-full max-w-md">    <div className="min-h-screen flex items-center justify-center px-4">  return (  };    }      setIsLoading(false);    } finally {      setError(err.message || 'Registration failed. Please try again.');    } catch (err: any) {      router.push('/blog');      await register(credentials);    try {        setError('');    setIsLoading(true);    e.preventDefault();  const handleSubmit = async (e: React.FormEvent) => {  };    }));      [name]: value      ...prev,    setCredentials(prev => ({    const { name, value } = e.target;  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {  const { register } = useAuth();  const router = useRouter();
