import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { LogIn, Mail, Lock } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuthStore } from '../stores/authStore';

type LoginFormValues = {
  email: string;
  password: string;
};

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    }
  });
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setLoginError(null);
    try {
      const success = await login(data.email, data.password);
      if (success) {
        navigate('/');
      } else {
        setLoginError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      setLoginError('An error occurred during login. Please try again.');
      console.error('Login error:', error);
    }
  };
  
  return (
    <div className="max-w-md mx-auto py-12">
      <Card className="p-8">
        <div className="text-center mb-8">
          <LogIn className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to access your MedExchange account</p>
        </div>
        
        {loginError && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {loginError}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            icon={<Mail className="w-5 h-5 text-gray-400" />}
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            error={errors.email?.message}
          />
          
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            icon={<Lock className="w-5 h-5 text-gray-400" />}
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            error={errors.password?.message}
          />
          
          <Button 
            type="submit" 
            variant="primary"
            fullWidth
            loading={isSubmitting}
          >
            Sign In
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Don't have an account yet?{' '}
            <Link to="/account-setup" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};
