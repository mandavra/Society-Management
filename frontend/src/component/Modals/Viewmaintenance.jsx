import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AiOutlineClose } from "react-icons/ai";
import { BsPersonBoundingBox } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";

const profileImage = "https://via.placeholder.com/150";

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
            <AiOutlineClose />
          </button>
        </div>

        {loading ? (
          <div className="p-4">
            <p className="text-center text-gray-500">Loading...</p>
          </div>
        ) : error || !requestData ? (
          <div className="p-4">
            <p className="text-center text-gray-500">{error || "No request data available."}</p>
          </div>
        ) : (
          <div>
            {/* Profile Section */}
            <div className="flex px-2 flex-col sm:flex-row items-center justify-center sm:justify-start">
              <img
                src={requestData.Image || profileImage}
                alt="Profile"
                className="w-12 h-12 rounded-full mx-2"
              />
              <div className="sm:ml-4 my-5">
                <h3 className="font-semibold">{requestData.Requester_Name || "N/A"}</h3>
                <p className="text-[#a7a7a7] text-sm">
                  {requestData.Request_Date
                    ? new Date(requestData.Request_Date).toLocaleDateString('en-GB')
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* First Grid: Wing, Unit, Status, Request Name */}
            <div className="grid grid-cols-1 sm:grid-cols-4 px-2">
              <div className="flex flex-col items-center border-r-2 border-gray-300">
                <span className="font-semibold text-[#a7a7a7]">Wing</span>
                <span className="bg-gray-100 text-[#5678e9] font-bold text-sm rounded-full w-7 h-7 flex items-center justify-center">
                  {requestData.Wing ? requestData.Wing.charAt(0) : "N/A"}
                </span>
              </div>
              <div className="flex flex-col items-center border-r-2 border-gray-300">
                <span className="font-semibold text-[#a7a7a7]">Unit</span>
                <span className="font-semibold text-gray-900">
                  {requestData.Unit || "N/A"}
                </span>
              </div>
              <div className="flex flex-col items-center border-r-2 border-gray-300">
                <span className="font-semibold text-[#a7a7a7]">Status</span>
                {requestData.Status === "Pending" ? (
                  <span className="px-2 py-1 text-sm flex justify-center items-center gap-1 rounded-full font-medium text-[#ffc313] bg-[#fff9e7]">
                    <MdOutlinePendingActions className="text-sm" /> Pending
                  </span>
                ) : requestData.Status === "Open" ? (
                  <span className="px-2 py-1 text-sm flex justify-center items-center gap-1 rounded-full font-medium text-[#5678e9] bg-[#eef1fd]">
                    <BsPersonBoundingBox className="text-sm" /> Open
                  </span>
                ) : (
                  <span className="px-2 py-1 text-sm flex justify-center items-center gap-1 rounded-full font-medium text-[#39973d] bg-[#ebf5ec]">
                    <FaCheckCircle className="text-sm" /> Solve
                  </span>
                )}
              </div>
              <div className="flex flex-col items-center">
                <span className="font-semibold text-[#a7a7a7]">Request Name</span>
                <span className="font-semibold text-gray-900">
                  {requestData.Request_Name || "N/A"}
                </span>
              </div>
            </div>

            {/* Second Grid: Priority, Status, Description */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-3 pb-4 px-2">
              <div className="flex flex-col items-center border-r-2 border-gray-300 sm:pr-4">
                <span className="font-semibold text-[#a7a7a7]">Priority</span>
                {requestData.Priority === "High" ? (
                  <span className="px-2 py-1 text-sm flex justify-center items-center gap-1 rounded-full font-medium text-white bg-[#e74c3c]">
                    High
                  </span>
                ) : requestData.Priority === "Medium" ? (
                  <span className="px-2 py-1 text-sm flex justify-center items-center gap-1 rounded-full font-medium text-white bg-[#5678e9]">
                    Medium
                  </span>
                ) : requestData.Priority === "Low" ? (
                  <span className="px-2 py-1 text-sm flex justify-center items-center gap-1 rounded-full font-medium text-white bg-[#39973d]">
                    Low
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-600 font-bold text-lg rounded-full w-10 h-10 flex items-center justify-center">
                    -
                  </span>
                )}
              </div>
              <div className="flex flex-col items-center border-r-2 border-gray-300 sm:px-4">
                <span className="font-semibold text-[#a7a7a7] pb-1">Status</span>
                {requestData.Status === "Pending" ? (
                  <span className="px-2 py-1 text-sm flex justify-center items-center gap-1 rounded-full font-medium text-[#ffc313] bg-[#fff9e7]">
                    <MdOutlinePendingActions className="text-sm" /> Pending
                  </span>
                ) : requestData.Status === "Open" ? (
                  <span className="px-2 py-1 text-sm flex justify-center items-center gap-1 rounded-full font-medium text-[#5678e9] bg-[#eef1fd]">
                    <BsPersonBoundingBox className="text-sm" /> Open
                  </span>
                ) : (
                  <span className="px-2 py-1 text-sm flex justify-center items-center gap-1 rounded-full font-medium text-[#39973d] bg-[#ebf5ec]">
                    <FaCheckCircle className="text-sm" /> Solve
                  </span>
                )}
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[#a7a7a7] font-semibold">Description</span>
                <span className="font-semibold text-gray-900 px-2 py-1 rounded-lg">
                  {requestData.Description || "No description available"}
                </span>
              </div>
            </div>

            {/* Phone Number */}
            <div className="px-2 pb-4">
              <div className="flex flex-col items-center">
                <span className="font-semibold text-[#a7a7a7]">Phone Number</span>
                <span className="font-semibold text-gray-900">
                  {requestData.phone || "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewReq;