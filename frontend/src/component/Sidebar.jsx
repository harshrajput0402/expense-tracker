import React, { useRef, useState, useEffect } from 'react'
import { cn, sidebarStyles } from '../assets/dummyStyles'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowDown, ArrowUp, HelpCircle, Home, LogOut, Menu, User, X } from 'lucide-react';

const MENU_ITEMS = [
    { text: "Dashboard", path: "/", icon: <Home size={20} /> },
    { text: "Income", path: "/income", icon: <ArrowUp size={20} /> },
    { text: "Expenses", path: "/expense", icon: <ArrowDown size={20} /> },
    { text: "Profile", path: "/profile", icon: <User size={20} /> },
];


function Sidebar({ user, isCollapsed, setIsCollapsed }) {

    const { pathname } = useLocation();
    const navigate = useNavigate();
    const sidebarRef = useRef(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeHover, setActivHover] = useState(null);
    const [ActiveHover, setActiveHover] = useState(null);

    const { name: username = "User", email = "user@example.com" } = user || {};
    const initial = username.charAt(0).toUpperCase();

    // t0 check for overflow in moblie 

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "auto";
        return () => { document.body.style.overflow = "auto" };
    }, [mobileOpen]);

    // // if you click outside the box then close the box
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (mobileOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
                setMobileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [mobileOpen]);

    // to handle for logout here back to login page and remove the token from local storage
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");

    }
    const toggleSidebar = () => { setIsCollapsed((prev) => !prev); };

    // a small component to render each menu item
    const renderMenuItem = ({ text, path, icon }) => {
        const isActive = pathname === path;
        return (
            <motion.li key={text} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                    to={path}
                    className={cn(
                        sidebarStyles.menuItem.base,
                        isActive ? sidebarStyles.menuItem.active : sidebarStyles.menuItem.inactive,
                        isCollapsed ? sidebarStyles.menuItem.collapsed : sidebarStyles.menuItem.expanded
                    )}
                    onMouseEnter={() => setActiveHover(text)}
                    onMouseLeave={() => setActiveHover(null)}
                >
                    <span className={isActive ? sidebarStyles.menuIcon.active : sidebarStyles.menuIcon.inactive}>
                        {icon}
                    </span>
                    {!isCollapsed && (
                        <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                            {text}
                        </motion.span>
                    )}
                    {activeHover === text && !isActive && !isCollapsed && (
                        <span className={sidebarStyles.activeIndicator}></span>
                    )}
                </Link>
            </motion.li>
        );
    };

    return (
        <>
            <motion.div ref={sidebarRef} className={sidebarStyles.sidebarContainer.base}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 3, opacity: 1, width: isCollapsed ? 80 : 256 }}
                transition={{ type: "spring", damping: 25 }}>
                <div className={sidebarStyles.sidebarInner.base} >
                    <button onClick={toggleSidebar} className={sidebarStyles.toggleButton} >
                        <motion.div
                            initial={{ rotate: 0 }}
                            animate={{ rotate: isCollapsed ? 0 : 180 }}
                            transition={{ duration: 0.3 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg"
                                width="28" height="70"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <polyline points={isCollapsed ? "9 18 15 12 9 6" : "15 18 9 12 15 6"}>

                                </polyline>
                            </svg>
                        </motion.div>
                    </button>
                    <div className={cn(sidebarStyles.userProfileContainer.base,
                        isCollapsed ? sidebarStyles.userProfileContainer.collapsed : sidebarStyles.userProfileContainer.expanded)}>

                        <div className='flex items-center'>
                            <div className={sidebarStyles.userInitials.base}>{initial}</div>
                            {!isCollapsed && (<motion.div
                                className="ml-3 overflow-hidden"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                            >
                                <h2 className="text-lg font-bold text-gray-800">
                                    {username?.charAt(0).toUpperCase() + username?.slice(1)}
                                </h2>
                                <p className=" text-xs text-gray-500 truncate" >{email}</p>
                            </motion.div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1  overflow-y-auto py-4 custom-scrollbar">
                        <ul className={sidebarStyles.menuList.base} >
                            {MENU_ITEMS.map((item) => renderMenuItem(item))}
                        </ul>
                    </div>
                    <div className={cn(
                        sidebarStyles.footerContainer.base,
                        isCollapsed ? sidebarStyles.footerContainer.collapsed
                            : sidebarStyles.footerContainer.expanded
                    )} >


                        <button onClick={handleLogout} className={cn(
                            sidebarStyles.logoutButton.base,
                            isCollapsed && sidebarStyles.logoutButton.collapsed
                        )}>
                            <LogOut size={20} className=" text-gray-500 "></LogOut>
                            {!isCollapsed && <span>Logout</span>}
                        </button>

                    </div>
                </div>
            </motion.div>
            <motion.button onClick={() => { setMobileOpen((prev) => !prev) }}
                className={sidebarStyles.mobileMenuButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }} >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}

            </motion.button>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className={sidebarStyles.mobileOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className={sidebarStyles.mobileBackdrop}
                            onClick={() => setMobileOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />

                        <motion.div
                            ref={sidebarRef}
                            className={sidebarStyles.mobileSidebar.base}
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        >
                            <div className=" relative h-full flex flex-col " >
                                <div className={sidebarStyles.mobileHeader} >
                                    <div classsName={sidebarStyles.mobileUserContainer}>
                                        <div className={sidebarStyles.userInitials.base}>
                                            {initial}
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-800">
                                                {username?.charAt(0).toUpperCase() + username?.slice(1)}
                                            </h2>
                                            <p className="text-sm text-gray-500" >{email}   </p>
                                        </div>
                                    </div>
                                    <button onClick={() => setMobileOpen(false)}
                                        className={sidebarStyles.mobileCloseButton}>
                                        <X size={24} className="text-gray-600" />

                                    </button>
                                </div>
                                <div className=" flex-1 overflow-y-auto py-4">
                                    <ul className={sidebarStyles.mobileMenuList}>
                                        {MENU_ITEMS.map(({ text, path, icon }) => (
                                            <motion.li key={text} whileTap={{ scale: 0.98 }}>
                                                <Link
                                                    to={path}
                                                    onClick={() => setMobileOpen(false)}
                                                    className={cn(
                                                        sidebarStyles.mobileMenuItem.base,
                                                        pathname === path
                                                            ? sidebarStyles.mobileMenuItem.active
                                                            : sidebarStyles.mobileMenuItem.inactive
                                                    )}
                                                >
                                                    <span className={pathname === path ? sidebarStyles.menuIcon.active : sidebarStyles.menuIcon.inactive}>
                                                        {icon}
                                                    </span>
                                                    <span>{text}</span>
                                                </Link>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={sidebarStyles.mobileFooter}>

                                    <button onClick={handleLogout} className={sidebarStyles.mobileLogoutButton} >
                                        <LogOut size={20} className=" text-gray-500 "></LogOut>
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Sidebar;