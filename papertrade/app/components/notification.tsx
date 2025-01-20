// Notification.tsx
import React from 'react';



export const Notification = (props:{ message: string, type: string, }) => {

    const {message, type,} = props

    return (
        <div 
            className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-md transform transition-all duration-500 flex items-center justify-between space-x-4
                ${type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' : 
                  'bg-red-100 border-l-4 border-red-500 text-red-700'}`}
        >
            <div className="flex items-center space-x-2">
                <div className="flex-shrink-0">
                    {type === 'success' ? (
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
                <div className="flex-1 text-sm font-medium">{message}</div>
            </div>
    
        </div>
    );
};