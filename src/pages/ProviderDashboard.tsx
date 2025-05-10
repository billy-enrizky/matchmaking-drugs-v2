import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, MapPin, Bell, ChevronDown, ChevronRight, MessageSquare, ExternalLink } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Match } from '../types';

// Mock data for demonstration
const mockMatches: Match[] = [
  {
    id: '1',
    requestId: 'req1',
    offerId: 'off1',
    requesterHospitalId: 'hosp1',
    providerHospitalId: 'hosp2',
    drugName: 'Amoxicillin',
    similarityScore: 1,
    distance: 3.2,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    requestId: 'req1',
    offerId: 'off2',
    requesterHospitalId: 'hosp3',
    providerHospitalId: 'hosp2',
    drugName: 'Ibuprofen',
    similarityScore: 0.95,
    distance: 8.7,
    status: 'notified',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    requestId: 'req2',
    offerId: 'off3',
    requesterHospitalId: 'hosp4',
    providerHospitalId: 'hosp2',
    drugName: 'Losartan',
    similarityScore: 0.85,
    distance: 12.3,
    status: 'agreed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    requestId: 'req2',
    offerId: 'off4',
    requesterHospitalId: 'hosp5',
    providerHospitalId: 'hosp2',
    drugName: 'Metformin',
    similarityScore: 0.82,
    distance: 24.1,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    requestId: 'req3',
    offerId: 'off5',
    requesterHospitalId: 'hosp6',
    providerHospitalId: 'hosp2',
    drugName: 'Atorvastatin',
    similarityScore: 0.91,
    distance: 18.5,
    status: 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock hospital data
const mockHospitals: Record<string, { name: string; address: string }> = {
  'hosp1': { name: 'City Medical Center', address: '123 Main St, Anytown' },
  'hosp3': { name: 'Mercy Medical Center', address: '456 Oak Ave, Somewhere' },
  'hosp4': { name: 'St. Mary\'s Hospital', address: '789 Elm St, Othertown' },
  'hosp5': { name: 'Regional Health Center', address: '101 Pine Rd, Faraway' },
  'hosp6': { name: 'University Hospital', address: '202 Cedar Ln, Nearby' },
};

const distanceOptions = [
  { value: 0, label: 'All Distances' },
  { value: 5, label: 'Within 5 km' },
  { value: 10, label: 'Within 10 km' },
  { value: 25, label: 'Within 25 km' },
  { value: 50, label: 'Within 50 km' },
  { value: 100, label: 'Within 100 km' },
  { value: 200, label: 'Within 200 km' },
];

export const ProviderDashboard: React.FC = () => {
  const [distanceFilter, setDistanceFilter] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);
  
  const filteredMatches = mockMatches.filter(match => {
    if (distanceFilter > 0 && match.distance > distanceFilter) {
      return false;
    }
    
    if (statusFilter && match.status !== statusFilter) {
      return false;
    }
    
    return true;
  });
  
  const toggleExpandMatch = (matchId: string) => {
    if (expandedMatch === matchId) {
      setExpandedMatch(null);
    } else {
      setExpandedMatch(matchId);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'notified':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Notified</span>;
      case 'agreed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Agreed</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Completed</span>;
      case 'declined':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Declined</span>;
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Drug Offers</h1>
          <p className="mt-2 text-gray-600">
            View and manage matches for your medication offers
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link to="/provide-drugs">
            <Button variant="primary">
              New Offer
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
          <div className="relative">
            <select
              value={distanceFilter}
              onChange={(e) => setDistanceFilter(Number(e.target.value))}
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-gray-900 bg-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            >
              {distanceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <div className="relative">
            <select
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-gray-900 bg-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="notified">Notified</option>
              <option value="agreed">Agreed</option>
              <option value="completed">Completed</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-end">
          <Button 
            variant="outline" 
            size="md"
            onClick={() => {
              setDistanceFilter(0);
              setStatusFilter(null);
            }}
            leftIcon={<Filter size={16} />}
          >
            Reset Filters
          </Button>
        </div>
      </div>
      
      {/* Matches list */}
      {filteredMatches.length === 0 ? (
        <Card className="p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
          <p className="text-gray-500 mb-6">
            {distanceFilter > 0 || statusFilter 
              ? "Try adjusting your filters to see more results."
              : "When hospitals request medications that match your offers, they'll appear here."}
          </p>
          <Link to="/provide-drugs">
            <Button variant="primary">Add More Medications</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredMatches.map((match) => (
            <Card key={match.id} className="overflow-hidden">
              <div 
                className="px-4 py-4 sm:px-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpandMatch(match.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-4">
                      {expandedMatch === match.id ? (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {match.drugName}
                      </h3>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span>
                          {mockHospitals[match.requesterHospitalId].name} • {match.distance.toFixed(1)} km away
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {getStatusBadge(match.status)}
                    <div className="ml-4 flex-shrink-0 text-right">
                      <div className="text-sm font-medium text-blue-600">
                        {(match.similarityScore * 100).toFixed(0)}% match
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(match.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {expandedMatch === match.id && (
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6 bg-gray-50">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Requesting Hospital</dt>
                      <dd className="mt-1 text-sm text-gray-900">{mockHospitals[match.requesterHospitalId].name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Address</dt>
                      <dd className="mt-1 text-sm text-gray-900">{mockHospitals[match.requesterHospitalId].address}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Distance</dt>
                      <dd className="mt-1 text-sm text-gray-900">{match.distance.toFixed(1)} kilometers</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Match Quality</dt>
                      <dd className="mt-1 text-sm text-gray-900">{(match.similarityScore * 100).toFixed(0)}%</dd>
                    </div>
                  </dl>
                  
                  <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
                    {match.status === 'pending' && (
                      <Button
                        variant="primary"
                        leftIcon={<Bell size={16} />}
                      >
                        Notify Requester
                      </Button>
                    )}
                    
                    {match.status === 'agreed' && (
                      <Link to={`/messaging/${match.id}`}>
                        <Button
                          variant="primary"
                          leftIcon={<MessageSquare size={16} />}
                        >
                          Send Message
                        </Button>
                      </Link>
                    )}
                    
                    {match.status === 'completed' && (
                      <Button
                        variant="outline"
                        leftIcon={<ExternalLink size={16} />}
                      >
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};