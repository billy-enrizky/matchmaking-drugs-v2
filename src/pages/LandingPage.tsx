import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Handshake, Clock, ShieldCheck, BarChart } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="py-12 md:py-16 lg:py-20 -mt-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Connect. Exchange. <span className="text-blue-600">Save Lives.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            A secure platform for hospitals to exchange medications efficiently,
            reducing waste and ensuring critical drugs reach those in need.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <Link to="/request-drugs" className="flex-1">
              <Button 
                variant="primary" 
                size="lg" 
                fullWidth 
                rightIcon={<ArrowRight size={18} />}
              >
                Request Drugs
              </Button>
            </Link>
            <Link to="/provide-drugs" className="flex-1">
              <Button 
                variant="outline" 
                size="lg" 
                fullWidth 
                rightIcon={<ArrowRight size={18} />}
              >
                Provide Drugs
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card hover className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <span className="font-bold text-lg">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Register Your Hospital</h3>
              <p className="text-gray-600">
                Create an account with your hospital details and verification information.
              </p>
            </Card>
            
            <Card hover className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <span className="font-bold text-lg">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Submit Your Needs</h3>
              <p className="text-gray-600">
                Request medications you need or list surplus drugs you can provide.
              </p>
            </Card>
            
            <Card hover className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <span className="font-bold text-lg">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Matched</h3>
              <p className="text-gray-600">
                Our system matches requests with available supplies from nearby hospitals.
              </p>
            </Card>
            
            <Card hover className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <span className="font-bold text-lg">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Complete Exchange</h3>
              <p className="text-gray-600">
                Connect with matched hospitals and arrange the medication exchange.
              </p>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Benefits */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Benefits of MedExchange
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Handshake className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Reduce Medication Waste</h3>
                <p className="text-gray-600">
                  Find new homes for surplus medications before they expire, reducing 
                  pharmaceutical waste and environmental impact.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Quick Access to Critical Drugs</h3>
                <p className="text-gray-600">
                  Quickly source urgently needed medications from nearby hospitals, 
                  potentially saving lives during shortages.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <ShieldCheck className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Secure and Compliant</h3>
                <p className="text-gray-600">
                  Our platform ensures all exchanges follow regulatory requirements
                  with complete tracking and documentation.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <BarChart className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Cost Savings</h3>
                <p className="text-gray-600">
                  Reduce expenses by sourcing medications from partner hospitals
                  instead of emergency orders at premium prices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Join the Hospital Network Today
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Start exchanging medications with other hospitals in your area.
            Register your hospital to get started.
          </p>
          <Link to="/account-setup">
            <Button variant="primary" size="lg">
              Register Your Hospital
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};