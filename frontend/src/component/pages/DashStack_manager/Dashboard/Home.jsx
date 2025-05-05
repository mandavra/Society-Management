import React, { useEffect, useState } from "react";
import Sidebar from "../../../layout/Sidebar";
import Header from "../../../layout/Header";
import Home_totle_card from "../../../layout/Home_totle_card";
import { MdOutlineAttachMoney } from "react-icons/md";
import TotalBalanceChart from "../../../layout/TotalBalanceChart";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
} from "chart.js";
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip
);
import { FaTrashAlt, FaEdit, FaPlus } from "react-icons/fa";
import {
  GetAnnouncement,
  GetComplainy,
  ImportantNumbersGet,
} from "../../../services/Api/api";
import { TiThMenu } from "react-icons/ti";
import CreateImportantNumbers from "../../../Modals/CreateImportantNumbers";
import EditImportantNumbers from "../../../Modals/EditImportantNumbers";
import OpenEditComplintModel from "../../../Modals/OpenEditComplintModel";
import { GrFormView } from "react-icons/gr";
import ViewComplintModel from "../../../Modals/ViewComplintModel";
import DeleteImportantNumbersModal from "../../../Modals/DeleteImportantNumbersModal";
import LodingDelete from "../../../layout/DeleteLoding";
import {
  DeleteComplaint,
  PendingMaintenancesmembers,
} from "../../../services/Api/api";
import useSidbarTogal from "../../../layout/useSidbarTogal";
import {
  MdAccountBalanceWallet,
  MdMoneyOff,
  MdPrecisionManufacturing,
} from "react-icons/md";

const Home = () => {
  const [isOpen, setIsOpen] = useState(true);
  let [data, setdata] = useState(280);
  let [getdata, setget] = useState(280);

  const toggleNav = () => {
    setIsOpen((prevState) => !prevState);
  };

  useSidbarTogal({ setdata, setget, isOpen });

  const [contacts, setContacts] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editModal, seteditModal] = useState(false);
  const [PendingMaintenance, setPendingMaintenance] = useState();
  const [Important_id, setImportant_id] = useState([]);

  useEffect(() => {
    Fdata();
  }, []);

  const Fdata = () => {
    ImportantNumbersGet(setContacts, setLoading);
  };

  // add numbers pop_up

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // edit numbers pop_up

  const OpneeditModal = (_id) => {
    seteditModal(true);
    setImportant_id(_id);
  };

  const closeeditModal = () => {
    seteditModal(false);
  };

  // edit numbers pop_up

  const [ImportantNumbersDelete, setImportantNumbersDelete] = useState(false);
  const [ImportantNumbersDeleteId, setImportantNumbersDeleteId] =
    useState(null);

  const OpnedeleteContact = (_id) => {
    setImportantNumbersDelete(true);
    setImportantNumbersDeleteId(_id);
  };

  const ClosedeleteContact = () => {
    setImportantNumbersDelete(false);
  };

  // get complaint List
  useEffect(() => {
    MainGET();
  }, []);

  const MainGET = () => {
    PendingMaintenancesmembers(setPendingMaintenance);
  };
  useEffect(() => {
    getComplaintdata();
  }, []);

  let [getComplaint, setgetComplaint] = useState([]);
  const [loadingcomplaint, setloadingcomplaint] = useState(true);
  const getComplaintdata = () => {
    GetComplainy(setgetComplaint, setloadingcomplaint);
  };

  // edit complaint List pop_up

  const [EditComplint, setEditComplint] = useState(false);
  const [ViewComplint, setViewComplint] = useState(false);
  const [DeleteComplint, setDeleteComplint] = useState(false);
  const [loadingcomplint, setloadingcomplint] = useState(false);
  const [a_id, seta_id] = useState([]);
  const [b_id, setb_id] = useState([]);
  const [c_id, setc_id] = useState([]);

  const OpneEditComplint = (_id) => {
    setEditComplint(true);
    seta_id(_id);
  };
  const closeEditComplint = () => {
    setEditComplint(false);
  };

  const OpneViewComplint = (_id) => {
    setViewComplint(true);
    setb_id(_id);
  };
  const closeViewComplint = () => {
    setViewComplint(false);
  };

  const OpneDeleteComplint = (_id) => {
    setDeleteComplint(true);
    setc_id(_id);
  };
  const CloseDeleteComplint = () => {
    setDeleteComplint(false);
  };
  const ComlintDelete = () => {
    DeleteComplaint(
      c_id,
      setloadingcomplint,
      CloseDeleteComplint,
      getComplaint,
      setgetComplaint
    );
  };
  const [activities, setActivities] = useState([]);
  const [Loding, setLoding] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    GetAnnouncement(setActivities, setLoding);
  };

  const getFirstLetter = (title) => {
    return title ? title.charAt(0).toUpperCase() : ""; // Get the first letter and capitalize it
  };
  return (
    <div>
      <Sidebar toggleNav={toggleNav} data={data} />
      <div id="main" className={`ml-[${getdata}px] max-[425px]:ml-0`}>
        <div className="open_he">
          <Header toggleNav={toggleNav} />
        </div>
        <main className="flex-1 space-y-6 ">
          <div className="p-6 space-y-4 bg-[#f0f5fb]">
            {/* Dashboard Cards */}
            <div className="grid xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 max-[425px]:grid-cols-2 gap-4">
              <Home_totle_card
                total_title="Total Balance"
                total_price="2,22,520"
                totle_color="text-white"
                totle_icon_bg_back="bg-[#e3f2fd]" // Light Blue Background
                totle_icon_bg="bg-[#1565c0]" // Darker Blue Icon
                totle_bg_border="border-[#1565c0]"
                totle_Noch="bg-[#bbdefb]" // Light Blue Line
                totle_simbol={<MdAccountBalanceWallet />} // Wallet = Balance
              />

              <Home_totle_card
                total_title="Total Income"
                total_price="55,000"
                totle_color="text-white"
                totle_icon_bg_back="bg-[#e1f5fe]" // Sky Blue Background
                totle_icon_bg="bg-[#0288d1]" // Blue Icon
                totle_bg_border="border-[#0288d1]"
                totle_Noch="bg-[#81d4fa]" // Matching Sky Blue Line
                totle_simbol={<MdOutlineAttachMoney />} // Money Icon = Income
              />

              <Home_totle_card
                total_title="Total Expense"
                total_price="20,550"
                totle_color="text-white"
                totle_icon_bg_back="bg-[#f3fafe]" // Super Light Blue Background
                totle_icon_bg="bg-[#039be5]" // Blue Icon
                totle_bg_border="border-[#039be5]"
                totle_Noch="bg-[#b3e5fc]" // Very Light Blue Line
                totle_simbol={<MdMoneyOff />} // Cross Money = Expense
              />

              <Home_totle_card
                total_title="Total Unit"
                total_price="20,550"
                totle_color="text-white"
                totle_icon_bg_back="bg-[#e8eaf6]" // Lavender Blue Background
                totle_icon_bg="bg-[#3f51b5]" // Deep Blue Icon
                totle_bg_border="border-[#3f51b5]"
                totle_Noch="bg-[#c5cae9]" // Blue Tint Line
                totle_simbol={<MdPrecisionManufacturing />} // Gears = Units
              />
            </div>

            {/* Complaint List and Upcoming Activity */}
            <div className="grid xl:grid-cols-1 grid-cols-1 gap-4">
              <div className="bg-white  xl:col-span-3 rounded-lg shadow">
                <div className="bg-white  rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Complaint List</h2>
                    <select className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Month</option>
                      <option>Week</option>
                      <option>Day</option>
                    </select>
                  </div>
                  <div className="overflow-x-auto h-32 px-2">
                    {loadingcomplaint ? (
                      <div className="flex justify-center h-full items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#4CC9FE]" />
                      </div>
                    ) : (
                      <table className="min-w-full text-left">
                        <thead>
                          <tr className="bg-[#eef1fd] text-gray-700">
                            <th className="px-4 py-2">Complainer Name</th>
                            <th className="px-4 py-2">Complaint Name</th>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2 text-center">Priority</th>
                            <th className="px-4 py-2 text-center">
                              Complain Status
                            </th>
                            <th className="px-4 py-2 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getComplaint.map((e, index) => {
                            return (
                              <tr
                                key={index}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="px-4 py-2 flex items-center space-x-2">
                                  <img
                                    className="w-8 h-8 rounded-full"
                                    src="https://res.cloudinary.com/ddf3pgcld/image/upload/v1733770799/bl9awma4kwu1d9tdrakp.png"
                                    alt="profile"
                                  />
                                  <span>{e.Complainer_Name}</span>
                                </td>
                                <td className="px-4 py-2">
                                  {e.Complaint_Name}
                                </td>
                                <td className="px-4 py-2">
                                  {new Date(e.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "2-digit",
                                      day: "2-digit",
                                      year: "numeric",
                                    }
                                  )}
                                </td>
                                <td className="px-4 py-2 text-center">
                                  <span
                                    className={`px-3 py-1 rounded-full text-md font-medium flex justify-center ${
                                      e.Priority === "High"
                                        ? "bg-[#e74c3c] text-white"
                                        : e.Priority === "Medium"
                                        ? "bg-[#5678e9] text-white"
                                        : e.Priority === "Low"
                                        ? "bg-[#39973d] text-white"
                                        : null
                                    }`}
                                  >
                                    {e.Priority}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-center">
                                  <span
                                    className={`px-3 py-1 rounded-full text-md font-medium flex justify-center ${
                                      e.Status === "Open"
                                        ? "bg-[#eef1fd] text-[#5678e9]"
                                        : e.Status === "Pending"
                                        ? "bg-[#fff9e7] text-[#ffc313]"
                                        : e.Status === "Solve"
                                        ? "bg-[#ebf5ec] text-[#39973d]"
                                        : null
                                    }`}
                                  >
                                    {e.Status}
                                  </span>
                                </td>
                                <td className="px-4 py-2 flex space-x-2 justify-center">
                                  <button
                                    className="text-green-500 p-1"
                                    onClick={() => OpneEditComplint(e._id)}
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    className="text-blue-500 text-2xl rounded"
                                    onClick={() => OpneViewComplint(e._id)}
                                  >
                                    <GrFormView />
                                  </button>
                                  <button
                                    onClick={() => OpneDeleteComplint(e._id)}
                                    className="text-red-500 p-1"
                                  >
                                    <FaTrashAlt />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}

                    {EditComplint && (
                      <OpenEditComplintModel
                        _id={a_id}
                        closeEditComplint={closeEditComplint}
                        LodData={getComplaintdata}
                      />
                    )}
                    {ViewComplint && (
                      <ViewComplintModel
                        _id={b_id}
                        closeViewComplint={closeViewComplint}
                      />
                    )}
                    {DeleteComplint && (
                      <LodingDelete
                        loading={loadingcomplint}
                        DeleteClick={ComlintDelete}
                        close={CloseDeleteComplint}
                        getComplaint={getComplaint}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Graph and Important Numbers */}
            <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-md col-span-1">
                <div className="bg-white rounded-xl">
                  {/* Header Section with Fixed Button Alignment */}
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Support Directory
                    </h2>
                    <div>
                      <button
                        onClick={openModal}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                      >
                        <FaPlus className="mr-2" />
                        Add Contact
                      </button>
                      {showModal && (
                        <CreateImportantNumbers
                          Fdata={Fdata}
                          setShowModal={closeModal}
                        />
                      )}
                    </div>
                  </div>

                  {/* Contact List Section */}
                  <div className="space-y-4 h-80 overflow-y-auto pr-2">
                    {loading ? (
                      <div className="flex justify-center h-full items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500" />
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                        {contacts.map((contact) => (
                          <div
                            key={contact._id}
                            className="flex justify-between items-start p-4 border border-gray-200 rounded-md shadow-sm hover:shadow-md transition"
                          >
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-700">
                                Name:{" "}
                                <span className="text-gray-500">
                                  {contact.Fullname}
                                </span>
                              </p>
                              <p className="text-sm text-gray-700">
                                Phone:{" "}
                                <span className="text-gray-500">
                                  {contact.Phonenumber}
                                </span>
                              </p>
                              <p className="text-sm text-gray-700">
                                Role:{" "}
                                <span className="text-gray-500">
                                  {contact.Work}
                                </span>
                              </p>
                            </div>
                            <div className="flex space-x-3 pt-1">
                              <button
                                onClick={() => OpnedeleteContact(contact._id)}
                                className="text-red-500 hover:text-red-600 transition"
                                title="Delete"
                              >
                                <FaTrashAlt />
                              </button>
                              <button
                                onClick={() => OpneeditModal(contact._id)}
                                className="text-blue-600 hover:text-blue-700 transition"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {editModal && (
                      <EditImportantNumbers
                        Fdata={Fdata}
                        _id={Important_id}
                        closeEditModal={closeeditModal}
                      />
                    )}

                    {ImportantNumbersDelete && (
                      <DeleteImportantNumbersModal
                        contacts={contacts}
                        setContacts={setContacts}
                        ClosedeleteContact={ClosedeleteContact}
                        _id={ImportantNumbersDeleteId}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-md col-span-1">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Pending Maintenances Members
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto">
                  {PendingMaintenance?.pendingMembers?.length > 0 ? (
                    PendingMaintenance.pendingMembers.map((member) => (
                      <div
                        key={member.residentId}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded-md shadow-sm border hover:shadow-md transition"
                      >
                        <div className="flex items-center space-x-2">
                          <img
                            className="w-8 h-8 rounded-full object-cover"
                            src={member.residentphoto}
                            alt="Resident"
                          />
                          <div className="leading-tight">
                            <p className="text-sm font-semibold text-gray-800">
                              {member.fullname}
                            </p>
                            <p className="text-xs text-gray-500">
                              {member.phone}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-xs text-gray-700 inline">
                            Unit:{" "}
                          </p>
                          <p className="text-blue-600 text-xs inline ml-1">
                            {member.unit}
                          </p>
                          <p className="text-sm text-gray-700 mt-1">
                            <span className="font-semibold">
                              Pending Maintenance:
                            </span>{" "}
                            {member.pendingMaintenances}
                          </p>
                          <p className="text-sm text-red-500 mt-1">
                            <span className="font-semibold">Amount:</span> $
                            {member.pendingAmount}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-3 col-span-2 text-gray-500">
                      No pending members found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
