import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../server/AuthContext";
import { useSelector } from "react-redux";
import { IoMenu, IoSunnyOutline } from "react-icons/io5";
import { LuMoon } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

function Navbar({ isDarkMode, toggleDarkMode }) {
  const [currentTime, setCurrentTime] = React.useState("");
  const { currentUser } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const { isActiveRoom } = useSelector((state) => state.roomReducer);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      const now = new Date();

      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;

      const dayName = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ][now.getDay()];
      const monthName = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ][now.getMonth()];
      const dayNum = now.getDate();
      // Add leading zero to minutes if needed
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

      setCurrentTime(
        `${formattedHours}:${formattedMinutes} ${ampm} ${dayName}, ${monthName} ${dayNum}`
      );
    }, 100);
    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  const handleLogout = () => {               
    signOut(auth).then(() => {
    // Sign-out successful.
        navigate("/");
        console.log("Signed out successfully")
    }).catch((error) => {
    // An error happened.
    });
}

  return (
    <>
      {isActiveRoom ? (
        <></>
      ) : (
        <>
          <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80">
            <div className="container mx-auto px-0 sm:px-6 lg:px-0 py-3">
              <div className="flex items-center justify-between">
                <div className="text-4xl text-primary">V Meet</div>
                <div className="flex items-center sm:gap-4">
                  <button
                    onClick={toggleDarkMode}
                    className=" cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label={
                      isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                    }
                  >
                    {isDarkMode ? (
                      <IoSunnyOutline className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <LuMoon className="w-5 h-5 text-gray-500" />
                    )}
                  </button>

                  <div className="hidden sm:block text-xl text-blue-400">
                    {currentTime}
                  </div>
                  {currentUser ? (
                    <div className="relative">
                      <div className='flex items-center justify-center text-white bg-slate-600 border rounded-2xl border-sky-500 cursor-pointer' 
                                      style={{width: '2em', height: '2em'}}  onClick={() => setIsMenuOpen(true)}>
                        <span>{currentUser.firstName[0].toUpperCase()}</span>
                      </div>

                      {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                          <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                          >
                            <button
                              onClick={() => handleLogout()}
                              className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                              role="menuitem"
                            >
                              Sign out
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="hidden sm:flex items-center gap-2">
                      <button
                        className="font-medium cursor-pointer transition-all duration-200 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-800 text-sm px-3 py-1.5 gap-1.5"
                        onClick={() => {}}
                      >
                        <Link to="/sign-in"> Sign in</Link>
                      </button>
                      <button
                        className="font-medium cursor-pointer transition-all duration-200 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 text-white bg-blue-900/90 hover:bg-blue-950 focus:ring-primary-300 text-sm px-3 py-1.5 gap-1.5"
                        onClick={() => {}}
                      >
                        <Link to="/sign-up"> Sign up</Link>
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="sm:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <IoMenu className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {/* Mobile menu */}
              {isMobileMenuOpen && (
                <div className="sm:hidden mt-4 pb-4">
                  {currentUser ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 px-2 py-2">
                        <div className='flex items-center justify-center text-white bg-slate-600 border rounded-2xl border-sky-500 cursor-pointer' 
                            style={{width: '2em', height: '2em'}}>
                          <span>{currentUser.firstName[0].toUpperCase()}</span>
                        </div>

                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {currentUser?.firstName + " " + currentUser?.lastName}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Sign out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setAuthModal("signin");
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full"
                      >
                        Sign in
                      </button>
                      <button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setAuthModal("signup");
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full"
                      >
                        Sign up
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>
        </>
      )}
    </>
  );
}

export default Navbar;
