
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewReq = ({ _id, closeViewComplint }) => {
  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    editdata();
  }, [_id]); // Refetch if _id changes

  const editdata = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://sms-backend-blue.vercel.app/request/getRequest/${_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Remove if not needed
        },
      });
      console.log('API response:', response.data); // Debug
      setRequestData(response.data); // Single object
      setLoading(false);
    } catch (err) {
      console.error('Error fetching request:', err);
      setError('Failed to fetch request data');
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeViewComplint();
      }}
    >
      <div className="bg-white rounded-lg shadow-lg w-11/12 lg:w-1/4 md:w-1/2">
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-lg font-semibold">View Request</h1>
          <button
            type="button"
            className="text-gray-600 hover:text-gray-800 text-2xl"
            onClick={closeViewComplint}
          >
            ×
          </button>
        </div>

        {loading ? (
          <p className="p-4 text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="p-4 text-center text-red-500">{error}</p>
        ) : requestData ? (
          <div className="p-4">
            <div className="flex items-center mb-4">
              <img
                src={requestData.Image || 'https://res.cloudinary.com/ddf3pgcld/image/upload/v1733770799/bl9awma4kwu1d9tdrakp.png'}
                alt="Profile"
                className="w-18 h-18 mr-5 rounded-full"
              />
              <div>
                <p className="font-semibold">{requestData.Requester_Name || 'N/A'}</p>
                <p className="text-sm font-semibold text-[#a7a7a7]">
                  {requestData.Request_Date
                    ? new Date(requestData.Request_Date).toLocaleDateString('en-GB')
                    : 'N/A'}
                </p>
              </div>
            </div>
            <div className="mb-3">
              <p className="text-[#a7a7a7]">Request Name</p>
              <p>{requestData.Request_Name || 'N/A'}</p>
            </div>
            <div className="mb-3">
              <p className="text-[#a7a7a7]">Description</p>
              <p>{requestData.Description || 'No description available'}</p>
            </div>
            <div className="mb-3 grid grid-cols-4 gap-2">
              <div className="text-center">
                <label className="block text-sm font-medium pb-2 text-[#a7a7a7]">Wing</label>
                <span className="px-2 py-1 text-[#5678e9] bg-[#f6f8fb] mr-2 rounded-full">
                  {requestData.Wing || 'N/A'}
                </span>
              </div>
              <div className="text-center">
                <label className="block text-sm font-medium pb-2 text-[#a7a7a7]">Unit</label>
                <span>{requestData.Unit || 'N/A'}</span>
              </div>
              <div className="text-center">
                <label className="block text-sm font-medium pb-2 text-[#a7a7a7]">Priority</label>
                <span
                  className={`px-3 py-1 rounded-full text-md font-medium ${
                    requestData.Priority === 'High'
                      ? 'bg-[#e74c3c] text-white'
                      : requestData.Priority === 'Medium'
                      ? 'bg-[#5678e9] text-white'
                      : requestData.Priority === 'Low'
                      ? 'bg-[#39973d] text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {requestData.Priority || 'N/A'}
                </span>
              </div>
              <div className="text-center">
                <label className="block text-sm font-medium pb-2 text-[#a7a7a7]">Status</label>
                <span
                  className={`px-3 py-1 rounded-full text-md font-medium ${
                    requestData.Status === 'Open'
                      ? 'bg-[#eef1fd] text-[#5678e9]'
                      : requestData.Status === 'Pending'
                      ? 'bg-[#fff9e7] text-[#ffc313]'
                      : requestData.Status === 'Solve'
                      ? 'bg-[#ebf5ec] text-[#39973d]'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {requestData.Status || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="p-4 text-center text-gray-500">No data found</p>
        )}
      </div>
    </div>
  );
};

export default ViewReq;