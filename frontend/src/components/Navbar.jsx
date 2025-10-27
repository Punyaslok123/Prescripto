import React, { useContext, useState } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
const Navbar = () => {
  const navigate = useNavigate(); // when onclick on the create account , navigate hook required

  // take the admin url 

   const adminUrl = import.meta.env.VITE_ADMIN_URL || "http://localhost:5174";

  // for responsiveness , to show the menu
  const [showMenu, setShowMenu] = useState(false);

  // const [token, setToken] = useState(true); // when we have token , that means we are logged in ,for temporatily we use it
  
  const {token,setToken,userData}=useContext(AppContext)


  // logOut function 

  const logOut= ()=>{
       setToken(false);
       localStorage.removeItem('token')
  }

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="fjwak"
      />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1">Home</li>
          <hr className="h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">ALL DOCTORS</li>
          <hr className=" h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">ABOUT</li>
          <hr className=" h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">CONTACT</li>
          <hr className="h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>

        {/* link the admin part */}

        <a
          href={adminUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2  inline-flex items-center px-3  py-1.5 border rounded bg-white text-sm font-medium hover:bg-gray-50"
        >
          Admin
        </a>
      </ul>

      {/* if the token is true then we will return the profile, otherwise return the create account  */}

      {/* in the profile if we click then a dropdown menu will open , so that why add - group relative in the parent div */}
      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img className="w-8 rounded-full" src={userData.image} alt="" />

            <img className="w-2.5" src={assets.dropdown_icon} alt="" />

            {/*if we hover on the image then dropdown will be visible */}

            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                {/* if we click each on this paragraph then we will redirect some path  */}
                <p
                  onClick={() => navigate("my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile{" "}
                </p>
                <p
                  onClick={() => navigate("my-appointments")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointments
                </p>
                <p onClick={logOut} className="hover:text-black cursor-pointer">
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            style={{ backgroundColor: "#5f6FFF" }}
            className="px-8 text-white py-3 rounded-full font-light block"
          >
            Create Account
          </button>
        )}

        {/* responsiveness  */}

        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt=""
        />
        {/* mobile menu (hidden for medium and large devices */}

        <div
          className={` ${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-36" src={assets.logo} alt="" />
            <img
              className="w-7"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt=""
            />
          </div>

          {/* on onClick setShowMenu(false)  so that mobile menu is get hidden  */}

          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className="px-4 py-2 rounded inline-block"> Home</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors">
              <p className="px-4 py-2 rounded inline-block"> ALL DOCTORS</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">
              <p className="px-4 py-2 rounded inline-block">ABOUT</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p className="px-4 py-2 rounded inline-block">CONTACT</p>
            </NavLink>

            <a
              href={adminUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center px-3 py-1.5 border rounded bg-white text-sm font-medium hover:bg-gray-50"
            >
              Admin
            </a>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

// navlink will add the extra active class if we are that page , so in the index.css -> add =>   .active hr{
//     @apply block
// }
