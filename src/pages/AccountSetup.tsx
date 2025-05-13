import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ChevronRight, Mail, ArrowLeft, UserPlus } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuthStore } from '../stores/authStore';

type FormStep = 'email' | 'register' | 'hospital' | 'address' | 'contact' | 'review';

type RegistrationFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

type HospitalFormValues = {
  hospitalName: string;
  licenseNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  representativeName: string;
  representativeTitle: string;
  email: string;
  phone: string;
};

export const AccountSetup: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<FormStep>('email');
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  
  const { 
    isAuthenticated, 
    tempEmail, 
    isRegistering,
    register: registerUser, 
    checkUserExists,
    registerHospital,
    setIsRegistering
  } = useAuthStore();
  
  // Redirect if already authenticated and has completed hospital setup
  useEffect(() => {
    if (isAuthenticated && !isRegistering) {
      navigate('/');
    }
  }, [isAuthenticated, isRegistering, navigate]);
  
  // Registration form
  const { 
    register: registerForm, 
    handleSubmit: handleSubmitRegistration, 
    getValues: getRegistrationValues,
    formState: { errors: registrationErrors, isSubmitting: isRegistrationSubmitting } 
  } = useForm<RegistrationFormValues>({
    defaultValues: {
      email: tempEmail || '',
      password: '',
      confirmPassword: '',
    }
  });
  
  // Hospital info form
  const { 
    register: registerHospitalForm, 
    handleSubmit: handleSubmitHospital, 
    watch: watchHospital,
    formState: { errors: hospitalErrors, isSubmitting: isHospitalSubmitting } 
  } = useForm<HospitalFormValues>({
    defaultValues: {
      hospitalName: '',
      licenseNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      representativeName: '',
      representativeTitle: '',
      email: tempEmail || '',
      phone: '',
    }
  });
  
  const hospitalFormValues = watchHospital();
  
  useEffect(() => {
    // Update email field in hospital form when tempEmail changes
    if (tempEmail && currentStep === 'hospital') {
      hospitalFormValues.email = tempEmail;
    }
  }, [tempEmail, currentStep]);
  
  const handleEmailCheck = async (data: { email: string }) => {
    try {
      const exists = await checkUserExists(data.email);
      if (exists) {
        // User already exists, redirect to login
        navigate('/login');
      } else {
        // User doesn't exist, proceed to registration
        setCurrentStep('register');
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setRegistrationError('An error occurred. Please try again.');
    }
  };
  
  const handleRegistration: SubmitHandler<RegistrationFormValues> = async (data) => {
    if (data.password !== data.confirmPassword) {
      setRegistrationError('Passwords do not match');
      return;
    }
    
    setRegistrationError(null);
    try {
      const success = await registerUser(data.email, data.password);
      if (success) {
        setIsRegistering(true);
        setCurrentStep('hospital');
      } else {
        setRegistrationError('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setRegistrationError('An error occurred during registration. Please try again.');
    }
  };
  
  const handleHospitalSubmit: SubmitHandler<HospitalFormValues> = async (data) => {
    try {
      const success = await registerHospital({
        name: data.hospitalName,
        licenseNumber: data.licenseNumber,
        address: {
          line1: data.addressLine1,
          line2: data.addressLine2,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
        },
        representative: {
          name: data.representativeName,
          title: data.representativeTitle,
          email: data.email,
          phone: data.phone,
        },
      });
      
      if (success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Hospital registration error:', error);
    }
  };
  
  const handleNext = () => {
    if (currentStep === 'hospital') setCurrentStep('address');
    else if (currentStep === 'address') setCurrentStep('contact');
    else if (currentStep === 'contact') setCurrentStep('review');
  };
  
  const handleBack = () => {
    if (currentStep === 'register') setCurrentStep('email');
    else if (currentStep === 'hospital') setCurrentStep('register');
    else if (currentStep === 'address') setCurrentStep('hospital');
    else if (currentStep === 'contact') setCurrentStep('address');
    else if (currentStep === 'review') setCurrentStep('contact');
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 'email':
        return (
          <>
            <div className="text-center mb-8">
              <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Get Started</h2>
              <p className="text-gray-600 mt-2">Enter your email to begin</p>
            </div>
            
            <form onSubmit={handleSubmitRegistration(handleEmailCheck)} className="space-y-6">
              <Input
                id="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                {...registerForm('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                error={registrationErrors.email?.message}
              />
              
              <Button 
                type="submit" 
                variant="primary"
                fullWidth
                rightIcon={<ChevronRight size={16} />}
                isLoading={isRegistrationSubmitting}
              >
                Continue
              </Button>
              
              <div className="text-center text-sm">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </>
        );
      
      case 'register':
        return (
          <>
            <div className="text-center mb-8">
              <UserPlus className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
              <p className="text-gray-600 mt-2">Set up your MedExchange account</p>
            </div>
            
            {registrationError && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {registrationError}
              </div>
            )}
            
            <form onSubmit={handleSubmitRegistration(handleRegistration)} className="space-y-5">
              <Input
                id="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                disabled
                {...registerForm('email')}
              />
              
              <Input
                id="password"
                label="Password"
                type="password"
                placeholder="Create a password"
                {...registerForm('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                error={registrationErrors.password?.message}
              />
              
              <Input
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                {...registerForm('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => value === getRegistrationValues('password') || 'Passwords do not match'
                })}
                error={registrationErrors.confirmPassword?.message}
              />
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleBack}
                  leftIcon={<ArrowLeft size={16} />}
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  fullWidth
                  isLoading={isRegistrationSubmitting}
                >
                  Create Account
                </Button>
              </div>
            </form>
          </>
        );
        
      case 'hospital':
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Hospital Information</h2>
            <div className="space-y-4">
              <Input
                id="hospitalName"
                label="Hospital Name"
                placeholder="Enter hospital name"
                {...registerHospitalForm('hospitalName', { required: 'Hospital name is required' })}
                error={hospitalErrors.hospitalName?.message}
              />
              <Input
                id="licenseNumber"
                label="License Number"
                placeholder="Enter hospital license number"
                {...registerHospitalForm('licenseNumber', { required: 'License number is required' })}
                error={hospitalErrors.licenseNumber?.message}
              />
            </div>
            <div className="mt-8 flex justify-between">
              <Button 
                type="button" 
                variant="outline"
                onClick={handleBack}
                leftIcon={<ArrowLeft size={16} />}
              >
                Back
              </Button>
              <Button 
                type="button" 
                onClick={handleNext}
                rightIcon={<ChevronRight size={16} />}
              >
                Next
              </Button>
            </div>
          </>
        );
        
      case 'address':
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Hospital Address</h2>
            <div className="space-y-4">
              <Input
                id="addressLine1"
                label="Address Line 1"
                placeholder="Street address, P.O. box, etc."
                {...registerHospitalForm('addressLine1', { required: 'Address is required' })}
                error={hospitalErrors.addressLine1?.message}
              />
              <Input
                id="addressLine2"
                label="Address Line 2 (Optional)"
                placeholder="Apartment, suite, unit, building, floor, etc."
                {...registerHospitalForm('addressLine2')}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="city"
                  label="City"
                  placeholder="Enter city"
                  {...registerHospitalForm('city', { required: 'City is required' })}
                  error={hospitalErrors.city?.message}
                />
                <Input
                  id="state"
                  label="State"
                  placeholder="Enter state"
                  {...registerHospitalForm('state', { required: 'State is required' })}
                  error={hospitalErrors.state?.message}
                />
              </div>
              <Input
                id="zipCode"
                label="ZIP Code"
                placeholder="Enter ZIP code"
                {...registerHospitalForm('zipCode', { required: 'ZIP code is required' })}
                error={hospitalErrors.zipCode?.message}
              />
            </div>
            <div className="mt-8 flex justify-between">
              <Button 
                type="button" 
                variant="outline"
                onClick={handleBack}
                leftIcon={<ArrowLeft size={16} />}
              >
                Back
              </Button>
              <Button 
                type="button" 
                onClick={handleNext}
                rightIcon={<ChevronRight size={16} />}
              >
                Next
              </Button>
            </div>
          </>
        );
        
      case 'contact':
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-4">
              <Input
                id="representativeName"
                label="Representative Name"
                placeholder="Enter full name"
                {...registerHospitalForm('representativeName', { required: 'Representative name is required' })}
                error={hospitalErrors.representativeName?.message}
              />
              <Input
                id="representativeTitle"
                label="Title / Position"
                placeholder="Enter title or position"
                {...registerHospitalForm('representativeTitle', { required: 'Title is required' })}
                error={hospitalErrors.representativeTitle?.message}
              />
              <Input
                id="email"
                label="Email Address"
                type="email"
                placeholder="Enter email address"
                {...registerHospitalForm('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                error={hospitalErrors.email?.message}
              />
              <Input
                id="phone"
                label="Phone Number"
                placeholder="Enter phone number"
                {...registerHospitalForm('phone', { required: 'Phone number is required' })}
                error={hospitalErrors.phone?.message}
              />
            </div>
            <div className="mt-8 flex justify-between">
              <Button 
                type="button" 
                variant="outline"
                onClick={handleBack}
                leftIcon={<ArrowLeft size={16} />}
              >
                Back
              </Button>
              <Button 
                type="button" 
                onClick={handleNext}
                rightIcon={<ChevronRight size={16} />}
              >
                Next
              </Button>
            </div>
          </>
        );
        
      case 'review':
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Review Information</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Hospital Details</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Hospital Name</p>
                      <p className="font-medium">{hospitalFormValues.hospitalName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">License Number</p>
                      <p className="font-medium">{hospitalFormValues.licenseNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Address</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="font-medium">{hospitalFormValues.addressLine1}</p>
                  {hospitalFormValues.addressLine2 && <p className="font-medium">{hospitalFormValues.addressLine2}</p>}
                  <p className="font-medium">
                    {hospitalFormValues.city}, {hospitalFormValues.state} {hospitalFormValues.zipCode}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Representative</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{hospitalFormValues.representativeName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Title</p>
                      <p className="font-medium">{hospitalFormValues.representativeTitle}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{hospitalFormValues.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{hospitalFormValues.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row justify-between gap-3">
              <Button 
                type="button" 
                variant="outline"
                onClick={handleBack}
                leftIcon={<ArrowLeft size={16} />}
              >
                Back
              </Button>
              <Button 
                type="button"
                variant="primary"
                onClick={handleSubmitHospital(handleHospitalSubmit)}
                isLoading={isHospitalSubmitting}
              >
                Complete Registration
              </Button>
            </div>
          </>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card className="p-6 md:p-8">
        {renderStep()}
      </Card>
    </div>
  );
};