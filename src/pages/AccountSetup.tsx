import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Check, ChevronRight } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

type FormStep = 'hospital' | 'address' | 'contact' | 'review';

type FormValues = {
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
  const [currentStep, setCurrentStep] = useState<FormStep>('hospital');
  
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
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
      email: '',
      phone: '',
    }
  });
  
  const formValues = watch();
  
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // In a real app, you would submit the data to your API here
    console.log('Submitted data:', data);
    
    // For demonstration purposes, simulate a network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Navigate to the landing page or dashboard
    navigate('/');
  };
  
  const handleNext = () => {
    if (currentStep === 'hospital') setCurrentStep('address');
    else if (currentStep === 'address') setCurrentStep('contact');
    else if (currentStep === 'contact') setCurrentStep('review');
  };
  
  const handleBack = () => {
    if (currentStep === 'address') setCurrentStep('hospital');
    else if (currentStep === 'contact') setCurrentStep('address');
    else if (currentStep === 'review') setCurrentStep('contact');
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 'hospital':
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Hospital Information</h2>
            <div className="space-y-4">
              <Input
                id="hospitalName"
                label="Hospital Name"
                placeholder="Enter hospital name"
                {...register('hospitalName', { required: 'Hospital name is required' })}
                error={errors.hospitalName?.message}
              />
              <Input
                id="licenseNumber"
                label="License Number"
                placeholder="Enter hospital license number"
                {...register('licenseNumber', { required: 'License number is required' })}
                error={errors.licenseNumber?.message}
              />
            </div>
            <div className="mt-8 flex justify-end">
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
                placeholder="Street address"
                {...register('addressLine1', { required: 'Address is required' })}
                error={errors.addressLine1?.message}
              />
              <Input
                id="addressLine2"
                label="Address Line 2 (Optional)"
                placeholder="Apartment, suite, unit, etc."
                {...register('addressLine2')}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="city"
                  label="City"
                  placeholder="City"
                  {...register('city', { required: 'City is required' })}
                  error={errors.city?.message}
                />
                <Input
                  id="state"
                  label="State/Province"
                  placeholder="State"
                  {...register('state', { required: 'State is required' })}
                  error={errors.state?.message}
                />
              </div>
              <Input
                id="zipCode"
                label="ZIP / Postal Code"
                placeholder="ZIP code"
                {...register('zipCode', { required: 'ZIP code is required' })}
                error={errors.zipCode?.message}
              />
            </div>
            <div className="mt-8 flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBack}
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
            <h2 className="text-2xl font-bold mb-6">Representative Information</h2>
            <div className="space-y-4">
              <Input
                id="representativeName"
                label="Representative Name"
                placeholder="Full name"
                {...register('representativeName', { required: 'Name is required' })}
                error={errors.representativeName?.message}
              />
              <Input
                id="representativeTitle"
                label="Job Title"
                placeholder="Job title"
                {...register('representativeTitle', { required: 'Job title is required' })}
                error={errors.representativeTitle?.message}
              />
              <Input
                id="email"
                type="email"
                label="Email Address"
                placeholder="email@hospital.org"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                error={errors.email?.message}
              />
              <Input
                id="phone"
                label="Phone Number"
                placeholder="(123) 456-7890"
                {...register('phone', { required: 'Phone number is required' })}
                error={errors.phone?.message}
              />
            </div>
            <div className="mt-8 flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBack}
              >
                Back
              </Button>
              <Button 
                type="button" 
                onClick={handleNext}
                rightIcon={<ChevronRight size={16} />}
              >
                Review
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
                <h3 className="text-lg font-medium text-gray-900 mb-3">Hospital Details</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p><span className="font-medium">Name:</span> {formValues.hospitalName}</p>
                  <p><span className="font-medium">License Number:</span> {formValues.licenseNumber}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Hospital Address</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p>{formValues.addressLine1}</p>
                  {formValues.addressLine2 && <p>{formValues.addressLine2}</p>}
                  <p>{formValues.city}, {formValues.state} {formValues.zipCode}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Representative Information</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p><span className="font-medium">Name:</span> {formValues.representativeName}</p>
                  <p><span className="font-medium">Title:</span> {formValues.representativeTitle}</p>
                  <p><span className="font-medium">Email:</span> {formValues.email}</p>
                  <p><span className="font-medium">Phone:</span> {formValues.phone}</p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBack}
              >
                Back
              </Button>
              <Button 
                type="submit" 
                isLoading={isSubmitting}
                rightIcon={<Check size={16} />}
              >
                Complete Registration
              </Button>
            </div>
          </>
        );
    }
  };
  
  const steps = [
    { id: 'hospital', label: 'Hospital Info' },
    { id: 'address', label: 'Address' },
    { id: 'contact', label: 'Contact Info' },
    { id: 'review', label: 'Review' },
  ];
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hospital Registration</h1>
        <p className="mt-2 text-gray-600">
          Register your hospital to start exchanging medications with other healthcare facilities.
        </p>
      </div>
      
      {/* Progress steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep === step.id ? 'border-blue-600 bg-blue-600 text-white' :
                  steps.findIndex(s => s.id === currentStep) > index ? 'border-blue-600 bg-blue-600 text-white' :
                  'border-gray-300 bg-white text-gray-500'
                }`}>
                  {steps.findIndex(s => s.id === currentStep) > index ? (
                    <Check size={16} />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                <span className="mt-2 text-xs font-medium text-gray-500">{step.label}</span>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 ${
                  steps.findIndex(s => s.id === currentStep) > index ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          {renderStep()}
        </form>
      </Card>
    </div>
  );
};