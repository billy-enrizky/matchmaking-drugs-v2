import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Plus, Upload, AlertCircle, X, MapPin } from 'lucide-react';
import Papa from 'papaparse';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

type RequestFormData = {
  drugName: string;
  din?: string;
  dosage?: string;
  city: string;
  state: string;
  zipCode: string;
  maxDistance: number;
};

interface DrugEntry {
  drugName: string;
  din?: string;
  dosage?: string;
  error?: string;
}

const distanceOptions = [
  { value: 5, label: 'Within 5 km' },
  { value: 10, label: 'Within 10 km' },
  { value: 25, label: 'Within 25 km' },
  { value: 50, label: 'Within 50 km' },
  { value: 100, label: 'Within 100 km' },
  { value: 200, label: 'Within 200 km' },
];

export const RequestDrugs: React.FC = () => {
  const navigate = useNavigate();
  const [drugList, setDrugList] = useState<DrugEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);
  
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<RequestFormData>({
    defaultValues: {
      maxDistance: 25, // Default to 25km
    }
  });

  const watchDrugName = watch('drugName');
  
  const onAddDrug = (e: React.FormEvent) => {
    e.preventDefault();
    const drugName = watch('drugName');
    const din = watch('din');
    const dosage = watch('dosage');

    if (!drugName) return;

    setDrugList([...drugList, { drugName, din, dosage }]);
    reset({ 
      drugName: '', 
      din: '', 
      dosage: '',
      city: watch('city'),
      state: watch('state'),
      zipCode: watch('zipCode'),
      maxDistance: watch('maxDistance')
    });
  };
  
  const removeDrug = (index: number) => {
    const newList = [...drugList];
    newList.splice(index, 1);
    setDrugList(newList);
  };
  
  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setCsvError(null);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData: DrugEntry[] = [];
        let hasErrors = false;
        
        results.data.forEach((row: any, index) => {
          const entry: DrugEntry = {
            drugName: row.drug_name || '',
            din: row.din || undefined,
            dosage: row.dosage_needed || undefined,
          };
          
          if (!entry.drugName) {
            entry.error = `Row ${index + 1}: Drug name is required`;
            hasErrors = true;
          }
          
          parsedData.push(entry);
        });
        
        if (hasErrors) {
          setCsvError('Some rows in the CSV file have errors. Please check and fix them.');
        } else if (parsedData.length === 0) {
          setCsvError('No valid drug entries found in the CSV file.');
        } else {
          setDrugList([...drugList, ...parsedData]);
        }
      },
      error: (error) => {
        setCsvError(`Error parsing CSV file: ${error.message}`);
      }
    });
    
    event.target.value = '';
  };
  
  const handleSubmitRequest = async (data: RequestFormData) => {
    if (drugList.length === 0) return;
    
    setIsSubmitting(true);
    
    const requestData = {
      drugs: drugList,
      location: {
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
      },
      maxDistance: data.maxDistance,
    };
    
    console.log('Submitting request:', requestData);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    navigate('/submission-status/request');
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Request Medications</h1>
        <p className="mt-2 text-gray-600">
          List medications your hospital needs. We'll match you with providers who have available stock.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Drug entry form */}
        <div className="md:col-span-3">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Add Medications</h2>
            
            <form onSubmit={onAddDrug} className="space-y-4">
              <Input
                id="drugName"
                label="Drug Name"
                placeholder="Enter drug name"
                {...register('drugName')}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="din"
                  label="DIN (Optional)"
                  placeholder="Drug Identification Number"
                  {...register('din')}
                />
                
                <Input
                  id="dosage"
                  label="Dosage (Optional)"
                  placeholder="e.g., 10mg, 25mL"
                  {...register('dosage')}
                />
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-lg font-medium mb-4">Delivery Location</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Input
                    id="city"
                    label="City"
                    placeholder="Enter city"
                    leftIcon={<MapPin size={16} />}
                    {...register('city', { required: 'City is required' })}
                    error={errors.city?.message}
                  />
                  
                  <Input
                    id="state"
                    label="State/Province"
                    placeholder="Enter state"
                    {...register('state', { required: 'State is required' })}
                    error={errors.state?.message}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="zipCode"
                    label="ZIP/Postal Code"
                    placeholder="Enter ZIP code"
                    {...register('zipCode', { required: 'ZIP code is required' })}
                    error={errors.zipCode?.message}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Distance
                    </label>
                    <select
                      {...register('maxDistance')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {distanceOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <Button
                type="submit"
                leftIcon={<Plus size={16} />}
                fullWidth
                disabled={!watchDrugName}
              >
                Add Medication
              </Button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-2">Upload CSV File</h3>
              <p className="text-sm text-gray-500 mb-4">
                Upload a CSV file with columns: drug_name (required), din (optional), dosage_needed (optional)
              </p>
              
              <label className="block">
                <span className="sr-only">Choose CSV file</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </label>
              
              {csvError && (
                <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{csvError}</span>
                </div>
              )}
            </div>
          </Card>
        </div>
        
        {/* Drug list */}
        <div className="md:col-span-2">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Medication List</h2>
            
            {drugList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Upload className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p>No medications added yet</p>
                <p className="text-sm mt-1">Add medications using the form or upload a CSV</p>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {drugList.map((drug, index) => (
                  <div 
                    key={index} 
                    className={`px-3 py-2 rounded-md border flex justify-between items-start ${
                      drug.error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div>
                      <p className="font-medium text-gray-800">{drug.drugName}</p>
                      {(drug.din || drug.dosage) && (
                        <p className="text-sm text-gray-500">
                          {drug.din && <span>DIN: {drug.din}</span>}
                          {drug.din && drug.dosage && <span> • </span>}
                          {drug.dosage && <span>Dosage: {drug.dosage}</span>}
                        </p>
                      )}
                      {drug.error && (
                        <p className="text-xs text-red-600 mt-1">{drug.error}</p>
                      )}
                    </div>
                    <button 
                      type="button"
                      onClick={() => removeDrug(index)}
                      className="text-gray-400 hover:text-red-500 p-1"
                      aria-label="Remove drug"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <form onSubmit={handleSubmit(handleSubmitRequest)}>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                disabled={drugList.length === 0}
                fullWidth
              >
                Submit Request
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};