import React, { useEffect, useState } from "react";
import Sidebar from "../../../layout/Sidebar";
import Header from "../../../layout/Header";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaCheckCircle, FaUser } from "react-icons/fa";
import { HiOutlineCash } from "react-icons/hi";
import { IoMdWallet } from "react-icons/io";
import { BsPersonBoundingBox } from "react-icons/bs";
import Otherincome from "./Income/Otherincome";
import SetMaintenancePwd from "../../../Modals/SetMaintenancePwd";
import Viewmaintenance from "../../../Modals/Viewmaintenance"; // Ensure correct import
import { GetMaintenance } from "../../../services/Api/api";
import { GrFormView } from "react-icons/gr";
import useSidbarTogal from "../../../layout/useSidbarTogal";

const Financial_Management = () => {
  const [isOpen, setIsOpen] = useState(true);
  let [data, setdata] = useState(280);
  let [getdata, setget] = useState(280);

  const toggleNav = () => {
    setIsOpen((prevState) => !prevState);
  };

  useSidbarTogal({ setdata, setget, isOpen });

  const [activeTab, setActiveTab] = useState("Maintenance");
  const [ShowMaintenance, setShowMaintenance] = useState(false);
  const [ShowViewUser, setShowViewUser] = useState(false);
  const [IdShow, setIdShow] = useState(null);
  const [udata, setudata] = useState([]);

  const OpenMaintenance = () => {
    setShowMaintenance(true);
  };
  const CloseMaintenance = () => {
    setShowMaintenance(false);
  };

  const OpenView = (maintenance) => {
    console.log("Opening view for:", maintenance); // Debug
    setShowViewUser(true);
    setIdShow(maintenance); // Pass the entire maintenance object
  };
  const CloseView = () => {
    setShowViewUser(false);
    setIdShow(null);
  };

  useEffect(() => {
    Fdata();
  }, []);

  const Fdata = () => {
    GetMaintenance(setudata);
  };

  // Calculate total maintenance and penalty amounts
  const totalMaintenance = udata.reduce((sum, item) => sum + (item.Maintenance_Amount || 0), 0);
  const totalPenalty = udata.reduce((sum, item) => sum + (item.Penalty_Amount || 0), 0);

  return (
    <div>
      <Sidebar toggleNav={toggleNav} data={data} />
      <div id="main" className={`ml-[${getdata}px] max-[425px]:ml-0`}>
        <Header toggleNav={toggleNav} />

        {/* Main Content */}
        <main className="flex-1 bg-[#f0f5fb] p-6">
          {activeTab === "Maintenance" && (
            <div className="flex flex-col lg:flex-row items-center justify-between p-4 mb-4 bg-white rounded-lg space-y-4 lg:space-y-0">
              {/* Cards Container */}
              <div className="flex space-x-4">
                {/* Maintenance Amount Card */}
                <div className="p-4 bg-white rounded-lg shadow-lg border-l-4 border-green-500 w-full lg:w-60">
                  <h3 className="text-gray-600 font-medium">Maintenance Amount</h3>
                  <p className="text-green-500 font-bold text-2xl">₹{totalMaintenance}</p>
                </div>

                {/* Penalty Amount Card */}
                <div className="p-4 bg-white rounded-lg shadow-lg border-l-4 border-red-500 w-full lg:w-60">
                  <h3 className="text-gray-600 font-medium">Penalty Amount</h3>
                  <p className="text-red-500 font-bold text-2xl">₹{totalPenalty}</p>
                </div>
              </div>

              {/* Set Maintenance Button */}
              <button
                onClick={OpenMaintenance}
                className="px-4 py-2 w-full lg:w-auto bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white rounded-lg font-semibold shadow-lg hover:from-orange-600 hover:to-yellow-600 transition duration-200"
              >
                Set Maintenance
              </button>
              {ShowMaintenance && (
                <SetMaintenancePwd Fdata={Fdata} setShowMaintenance={CloseMaintenance} />
              )}
            </div>
          )}

          {/* Tabs */}
          <div className="flex">
            <button
              className={`py-2 px-8 font-semibold text-center rounded-t-lg border-b-2 border-b-blue-500 ${
                activeTab === "Maintenance"
                  ? "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => setActiveTab("Maintenance")}
            >
              Maintenance
            </button>
            <button
              className={`py-2 px-8 font-semibold text-center rounded-t-lg border-b-2 border-b-blue-500 ${
                activeTab === "Other_Income"
                  ? "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => setActiveTab("Other_Income")}
            >
              Other Income
            </button>
          </div>

          {activeTab === "Maintenance" && (
            <div className="p-4 bg-white rounded-lg shadow-lg overflow-x-auto">
              {udata.length === 0 ? (
                <p className="text-center text-gray-500">No maintenance records found.</p>
              ) : (
                <table className="w-full table-auto">
                  <thead className="bg-blue-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-center">Unit Number</th>
                      <th className="px-4 py-2 text-center">Date</th>
                      <th className="px-4 py-2 text-center">Status</th>
                      <th className="px-4 py-2 text-center">Phone Number</th>
                      <th className="px-4 py-2 text-center">Amount</th>
                      <th className="px-4 py-2 text-center">Penalty</th>
                      <th className="px-4 py-2 text-center">Status</th>
                      <th className="px-4 py-2 text-center">Payment</th>
                      <th className="px-4 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {udata.map((e, index) => (
                      <tr
                        key={index}
                        className="border-b bg-white hover:bg-gray-50 font-medium text-center md:font-semibold overflow-x-scroll"
                      >
                        <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700 flex items-center">
                          <img
                            className="w-8 h-8 rounded-full mr-1"
                            src={e.img || "https://via.placeholder.com/40"}
                            alt="profile"
                          />
                          <span>{e.name || "N/A"}</span>
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700 truncate">
                          <span className="px-2 py-1 text-[#5678e9] bg-[#f6f8fb] mr-2 rounded-full">
                            {e.unit || "N/A"}
                          </span>
                          {e.unit_Num || "N/A"}
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700 truncate">
                          {e.Maintenance_Due_Date
                            ? new Date(e.Maintenance_Due_Date).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700 truncate">
                          {e.status === "Owner" ? (
                            <span className="px-2 py-1 flex justify-center items-center gap-1 rounded-full font-medium text-[#4f46e5] bg-[#f1f0ff]">
                              <BsPersonBoundingBox className="text-sm" /> Owner
                            </span>
                          ) : (
                            <span className="px-2 py-1 flex justify-center items-center gap-1 rounded-full font-medium text-[#ec4899] bg-[#fff1f8]">
                              <FaUser className="text-sm" /> Tenant
                            </span>
                          )}
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700 truncate">
                          {e.phone || "N/A"}
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700 truncate">
                          ₹{e.Maintenance_Amount || 0}
                        </td>
                        <td className="p-4">
                          {e.Penalty_Amount === 0 || !e.Penalty_Amount ? (
                            <span className="bg-[#f6f8fb] text-xs flex justify-center rounded-full py-1 px-3 font-semibold">
                              -
                            </span>
                          ) : (
                            <span className="bg-[#e74c3c] text-xs flex justify-center rounded-full py-1 px-3 text-white font-semibold">
                              ₹{e.Penalty_Amount}
                            </span>
                          )}
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700">
                          {e.paymentstatus === "Pending" ? (
                            <span className="px-2 py-1 flex justify-center items-center gap-1 rounded-full font-medium bg-[#fff9e7] text-[#ffc313]">
                              <MdOutlinePendingActions /> Pending
                            </span>
                          ) : (
                            <span className="px-2 py-1 flex justify-center items-center gap-1 rounded-full font-medium bg-[#ebf5ec] text-[#39973d]">
                              <FaCheckCircle /> Done
                            </span>
                          )}
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700">
                          {e.paymentMethod && e.paymentMethod.toLowerCase() === "online" ? (
                            <span className="px-2 py-1 flex justify-center items-center gap-1 rounded-full font-medium bg-[#eef1fd] text-[#5678e9]">
                              <IoMdWallet /> Online
                            </span>
                          ) : (
                            <span className="px-2 py-1 flex justify-center items-center gap-1 rounded-full font-medium bg-[#f4f4f4] text-[#202224]">
                              <HiOutlineCash /> Cash
                            </span>
                          )}
                        </td>
                        <td className="px-2 justify-center md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700 flex space-x-2 md:space-x-2">
                          <button
                            className="text-blue-500 bg-[#f6f8fb] px-1 text-2xl rounded-lg"
                            onClick={() => OpenView(e)} // Pass entire maintenance object
                          >
                            <GrFormView />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "Other_Income" && (
            <div>
              <Otherincome />
            </div>
          )}
          {ShowViewUser && <Viewmaintenance close={CloseView} maintenance={IdShow} />}
        </main>
      </div>
    </div>
  );
};

export default Financial_Management;