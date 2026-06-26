import React, { useState, useRef, useEffect } from 'react'
import { navbarStyles } from '../assets/dummyStyles'
import img1 from '../assets/hero.png'
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { ChevronDown, LogOut, User } from 'lucide-react';

const BASE_URL = 'http://localhost:3000/api';

function Navbar({ user: propUser, onLogout }) {

  const menuRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = propUser || {
    name: "",
    email: "",
  };

  // to fetch user data 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await axios.get(`${BASE_URL}/user/get`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const userData = response.data.user || response.data;
        setUser(userData);
      }
      catch (err) {
        console.log("failed to load profile", err);
      }
    };

    if (!propUser) {
      fetchUserData();
    }

  }, [propUser]);

  const toggleMenu = () => { setMenuOpen((prev) => !prev); };
  const handleLogout = () => {
    setMenuOpen(false);
    localStorage.removeItem("token");
    onLogout?.();
    navigate("/login");
  }

  const navigate = useNavigate();
  // close the toggle menu if you click outside the menu 
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <header className={navbarStyles.header}>
      <div className={navbarStyles.container}>
        {/* logo */}
        <div onClick={() => navigate("/")} className={navbarStyles.logoContainer}>

          <div className={navbarStyles.logoImage}>
            <img src={img1} alt='logo' />
          </div>
          <span className={navbarStyles.logoText}> Expense Tracker</span>
        </div>

        {/* if the user is present */}
        {user &&
          <div className={navbarStyles.userContainer} ref={menuRef}>
            <button onClick={toggleMenu} className={navbarStyles.userButton}>
              <div className=" relative">
                <div className={navbarStyles.userAvatar}>
                  {user?.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <div className={navbarStyles.statusIndicator}></div>
              </div>
              <div className={navbarStyles.userTextContainer}>
                <p className={navbarStyles.userName}>
                  {user?.name
                    ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
                    : "User"}
                </p>
                <p className={navbarStyles.userEmail}> {user?.email || "user@expansetracker.com"}</p>
              </div>
              <ChevronDown className={navbarStyles.chevronIcon(menuOpen)}></ChevronDown>
            </button>
            {/* drop down menu over here  */}

            {menuOpen && <div className={navbarStyles.dropdownMenu}>
              <div className={navbarStyles.dropdownHeader}>
                <div className='flex items-center gap-3'>
                  <div className={navbarStyles.dropdownAvatar}>
                    {user?.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                  <div>
                    <div className={navbarStyles.dropdownName}>{user?.name || "User"}</div>
                    <div className={navbarStyles.dropdownEmail}>{user?.email || "user@expansetracker.com"}</div>
                  </div>
                </div>
              </div>
              <div className={navbarStyles.menuItemContainer}>
                <button onClick={() => {
                  setMenuOpen(false);
                  navigate("/profile");
                }} className={navbarStyles.menuItem}>
                  <User className=' w-4 h-4' />
                  <span>My Profile</span>
                </button>
              </div>

              <div className={navbarStyles.menuItemBorder}>
                <button onClick={handleLogout} className={navbarStyles.logoutButton}>
                  {/* <LogOut className='w-4 h-4'/> */}
                  <LogOut className='w-4 h-4' />
                  <span> Log out</span>
                </button>
              </div>




            </div>}
          </div>}
      </div>
    </header>
  );
}

export default Navbar