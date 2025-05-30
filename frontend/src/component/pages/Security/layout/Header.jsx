import React, { useEffect, useState } from 'react'
import { GiHamburgerMenu } from "react-icons/gi";
import OpneNotificationModal from '../../../Modals/OpneNotificationModal';
import { Profile_img } from '../Api/Api';
import { Link } from 'react-router-dom';


const Header = ({toggleNav}) => {
  const [FormData, setFormData] = useState('')

  useEffect(() => {
    Fdata();
  }, []);

  const Fdata = () => {
    Profile_img(setFormData);
  };

  return (
    <div>
      <header className="flex justify-between p-4 bg-white items-center">
        <div className='flex'>
          <span className='flex items-center mr-5' style={{ fontSize: 30, cursor: "pointer" }} onClick={toggleNav}>
            <GiHamburgerMenu />
          </span>
          <input type="text" placeholder="Search Here" className="w-full max-w-md px-4 py-2 border rounded-lg" />
        </div>
        <div className="flex items-center space-x-4">

          <OpneNotificationModal />
          <Link className="flex items-center space-x-4" >
            {FormData ? (
              <div className="flex items-center">
                <div className="Profie-img mr-3">
                  <img
                    src={FormData.Image || "/images/user.png"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                </div>
                <div className="profile-text">
                  <p className="font-medium">{FormData.Full_Name || "User"}</p>
                  <p className="text-gray-400">{FormData.Role
                    || "Role"}</p>
                </div>
              </div>
            ) : (
              <div>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#4CC9FE]" />
              </div>
            )}
          </Link>
        </div>
      </header>
    </div>
  )
}

export default Header
