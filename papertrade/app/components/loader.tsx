import React from 'react';
import { Loader2 } from 'lucide-react';


const LoadingSpinner = () => {
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center `}>
      <Loader2 
        className={`animate-spin text-primary h-8 w-8  text-indigo-800`}
        aria-label="Loading"
      />
     
        <span className="mt-2 text-sm  text-indigo-800">Loading...</span>
 
    </div>
  );
};

export default LoadingSpinner;