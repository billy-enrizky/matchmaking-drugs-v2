import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Mail } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import { useAuthStore } from '../stores/authStore';

interface EmailLookupProps {
  onExistingUser: () => void;
  onNewUser: () => void;
}

type EmailFormValues = {
  email: string;
};

export const EmailLookup: React.FC<EmailLookupProps> = ({ 
  onExistingUser,
  onNewUser
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { checkUserExists, setTempEmail } = useAuthStore();
  
  const { register, handleSubmit, formState: { errors } } = useForm<EmailFormValues>({
    defaultValues: {
      email: ''
    }
  });
  
  const onSubmit: SubmitHandler<EmailFormValues> = async (data) => {
    setIsChecking(true);
    setError(null);
    try {
      const exists = await checkUserExists(data.email);
      setTempEmail(data.email);
      
      if (exists) {
        onExistingUser();
      } else {
        onNewUser();
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };
  
  return (
    <div>
      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
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
        
        <Button 
          type="submit" 
          variant="primary"
          fullWidth
          loading={isChecking}
        >
          Continue
        </Button>
      </form>
    </div>
  );
};
