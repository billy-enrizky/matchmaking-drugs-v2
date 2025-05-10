import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const SubmissionStatus: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'completed'>('processing');
  
  useEffect(() => {
    // Simulate processing time
    const timer = setTimeout(() => {
      setStatus('completed');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const isRequest = type === 'request';
  
  const navigateToDashboard = () => {
    if (isRequest) {
      navigate('/requester-dashboard');
    } else {
      navigate('/provider-dashboard');
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <Card className="text-center py-10">
        {status === 'processing' ? (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isRequest 
                ? "Matching you with available providers..." 
                : "Matching you with potential buyers..."}
            </h2>
            <p className="text-gray-600 mb-6">
              {isRequest
                ? "We're searching for hospitals with matching medications."
                : "We're finding hospitals that need your medications."}
            </p>
            <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-2.5 mb-6">
              <div className="bg-blue-600 h-2.5 rounded-full w-2/3 animate-pulse"></div>
            </div>
            <p className="text-sm text-gray-500">
              This process may take a moment. Please wait...
            </p>
          </>
        ) : (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isRequest 
                ? "Request Submitted Successfully!" 
                : "Offer Submitted Successfully!"}
            </h2>
            <p className="text-gray-600 mb-8">
              {isRequest
                ? "We'll notify you when matching medications are found."
                : "We'll notify you when hospitals request your medications."}
            </p>
            <Button onClick={navigateToDashboard}>
              {isRequest ? "View My Requests" : "View My Offers"}
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};