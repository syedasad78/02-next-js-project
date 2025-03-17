'use client';

import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useApiKeys } from '@/hooks/useApiKeys';
import { ApiKeyTable } from '@/components/ApiKeyTable';
import Sidebar from '@/components/Sidebar';

export default function Dashboard() {
  const {
    apiKeys,
    loading,
    error,
    createApiKey,
    updateApiKey,
    deleteApiKey,
  } = useApiKeys();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [newKeyData, setNewKeyData] = useState({
    name: '',
    type: 'dev',
    usage_limit: ''
  });

  const generateApiKey = (type) => {
    const prefix = 'wsm';
    const randomPart = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);
    return `${prefix}_${type}_${randomPart}`;
  };

  const handleCreateKey = async (e) => {
    e.preventDefault();
    const apiKeyValue = generateApiKey(newKeyData.type);
    
    const success = await createApiKey({
      ...newKeyData,
      value: apiKeyValue
    });

    if (success) {
      setIsCreateModalOpen(false);
      setNewKeyData({ name: '', type: 'dev', usage_limit: '' });
    }
  };

  const handleEditKey = async (e) => {
    e.preventDefault();
    const success = await updateApiKey(editingKey.id, newKeyData);
    if (success) {
      setEditingKey(null);
      setNewKeyData({ name: '', type: 'dev', usage_limit: '' });
    }
  };

  const handleDeleteKey = async (id) => {
    await deleteApiKey(id);
  };

  const openEditModal = (key) => {
    setEditingKey(key);
    setNewKeyData({
      name: key.name,
      type: key.type,
      usage_limit: key.usage_limit || ''
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1">
        <Toaster />
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-[#ff6b6b] via-[#a855f7] to-[#3b82f6] dark:from-[#7f1d1d] dark:via-[#4c1d95] dark:to-[#1e3a8a] p-8 pb-16 rounded-xl mx-4 my-4">
          <div className="max-w-6xl mx-auto space-y-6">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">CURRENT PLAN</span>
            <h1 className="text-4xl font-bold text-white">Researcher</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-200">API Usage</span>
              <span className="text-sm text-gray-300">1/1,000 Credits</span>
            </div>
          </div>
        </div>

        {/* API Keys Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">API Keys</h2>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                The key is used to authenticate your requests to the Research API.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Create API Key
              </button>
            </div>
          </div>

          {loading ? (
            <div className="mt-8 text-center">Loading...</div>
          ) : error ? (
            <div className="mt-8 text-center text-red-600">{error}</div>
          ) : (
            <ApiKeyTable
              apiKeys={apiKeys}
              onDelete={handleDeleteKey}
              onEdit={openEditModal}
            />
          )}
        </div>

        {/* Create/Edit Modal */}
        {(isCreateModalOpen || editingKey) && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <form onSubmit={editingKey ? handleEditKey : handleCreateKey}>
                    <div>
                      <div className="mt-3 text-center sm:mt-5">
                        <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                          {editingKey ? 'Edit API Key' : 'Create New API Key'}
                        </h3>
                        <div className="mt-2">
                          <div className="space-y-4">
                            <div>
                              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                id="name"
                                value={newKeyData.name}
                                onChange={(e) => setNewKeyData(prev => ({ ...prev, name: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                required
                              />
                            </div>
                            <div>
                              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Type
                              </label>
                              <select
                                id="type"
                                name="type"
                                value={newKeyData.type}
                                onChange={(e) => setNewKeyData(prev => ({ ...prev, type: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              >
                                <option value="dev">Development</option>
                                <option value="prod">Production</option>
                              </select>
                            </div>
                            <div>
                              <label htmlFor="usage_limit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Usage Limit (optional)
                              </label>
                              <input
                                type="number"
                                name="usage_limit"
                                id="usage_limit"
                                value={newKeyData.usage_limit}
                                onChange={(e) => setNewKeyData(prev => ({ ...prev, usage_limit: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                      <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2"
                      >
                        {editingKey ? 'Save Changes' : 'Create'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreateModalOpen(false);
                          setEditingKey(null);
                          setNewKeyData({ name: '', type: 'dev', usage_limit: '' });
                        }}
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:col-start-1 sm:mt-0"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 