'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { validateApiKey } from '@/services/validateApiKey';
import { toast, Toaster } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';

export default function Protected() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isValidating, setIsValidating] = useState(true);
  const [validationResult, setValidationResult] = useState(null);

  useEffect(() => {
    async function checkApiKey() {
      const apiKey = searchParams.get('key');
      
      if (!apiKey) {
        toast.error('No API key provided', {
          duration: 3000,
          style: {
            background: '#ef4444',
            color: '#fff',
          },
        });
        router.push('/playground');
        return;
      }

      try {
        const result = await validateApiKey(apiKey);
        setValidationResult(result);
        
        if (result.isValid) {
          toast.success(result.message, {
            duration: 3000,
            style: {
              background: '#22c55e',
              color: '#fff',
            },
          });
        } else {
          throw new Error('Invalid API Key');
        }
      } catch (error) {
        console.error('Validation error:', error);
        toast.error('Invalid API Key, Protected Page cannot be accessed', {
          duration: 3000,
          style: {
            background: '#ef4444',
            color: '#fff',
          },
        });
        // Redirect back to playground after showing error
        setTimeout(() => {
          router.push('/playground');
        }, 3000);
      } finally {
        setIsValidating(false);
      }
    }

    checkApiKey();
  }, [router, searchParams]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Toaster position="top-center" />
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            Protected Content
          </h1>
          
          {isValidating ? (
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400">Validating API key...</p>
            </div>
          ) : validationResult?.isValid ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Welcome to the Protected Area
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Your API key has been validated successfully. You now have access to this protected content.
              </p>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
} 