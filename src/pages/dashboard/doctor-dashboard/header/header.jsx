// import React, { useState, useEffect, useMemo } from "react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./header.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import NotificationDropdown from "../../notification/NotificationPatient";
import {
  deleteData,
  fetchData,
  updateData,
} from "../../../../hooks/services/services";
import { getProfileClass } from "../../../../utils/common";

export const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isProfiledata = useSelector((state) => state?.userProfile?.userProfile);
  const documentVerification = useSelector(
    (state) => state?.documentVerification?.documentVerification
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [profileStatus, setProfileStatus] = useState("Rejected");
  const [isDoctorFavorite, setIsDoctorFavorite] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language.toUpperCase());
  const sidebarColRef = useRef(null);
  const sidebarmenuRef = useRef(null);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const response = await fetchData("notifications/");
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(data.notifications);
    } catch (error) {}
  };
  const markNotificationAsRead = async (id) => {
    try {
      await updateData(`notifications/notification-read/${id}/`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  useEffect(() => {
    if (documentVerification.length) {
      const determineStatus = () => {
        if (documentVerification.some((doc) => doc.status === "Rejected")) {
          setProfileStatus("Rejected");
        } else if (
          documentVerification.some((doc) => doc.status === "Pending")
        ) {
          setProfileStatus("Pending");
        } else {
          setProfileStatus("Verified");
        }
      };
      determineStatus();
    }
  }, [documentVerification]);

  const deleteNotification = async (id) => {
    try {
      await deleteData(`notifications/notification-delete/${id}/`);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen); // Toggle notification dropdown
  };

  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.is_read
  );

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (location.pathname === "/patient/FavClinic") {
      setIsFavorite(true);
      setIsDoctorFavorite(false);
    } else if (location.pathname === "/patient/FavDoctor") {
      setIsDoctorFavorite(true);
      setIsFavorite(false);
    } else {
      setIsFavorite(false);
      setIsDoctorFavorite(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const sidebarCol = sidebarColRef.current;
    const handleSidebarColClick = () => {
      const aside = document.querySelector("aside");
      const rightContent = document.querySelector(".rightContent");
      aside?.classList.toggle("sidebarClose");
      rightContent?.classList.toggle("rightsidefull");
    };
    sidebarCol?.addEventListener("click", handleSidebarColClick);

    // Second block: .sidebarmenu click event
    const sidebarmenu = sidebarmenuRef.current;
    const handleSidebarMenuClick = () => {
      const aside = document.querySelector("aside");
      const rightContent = document.querySelector(".rightContent");
      const body = document.querySelector("body");
      aside?.classList.toggle("sidebarsmall");
      rightContent?.classList.toggle("rightsidefullmobile");
      body?.classList.toggle("bodyopen");
    };
    sidebarmenu?.addEventListener("click", handleSidebarMenuClick);

    // Cleanup event listeners when the component is unmounted
    return () => {
      sidebarCol?.removeEventListener("click", handleSidebarColClick);
      sidebarmenu?.removeEventListener("click", handleSidebarMenuClick);
    };
  }, []);

  const auth = useSelector((state) => state.auth);

  const languages = [
    { code: "en", label: "English" },
    { code: "fr", label: "French" },
    { code: "es", label: "Spanish" },
    { code: "ro", label: "Romanian" },
    { code: "bg", label: "Bulgarian" },
    { code: "lt", label: "Lithuanian" },
    { code: "pl", label: "Polish" },
    { code: "uk", label: "Ukrainian" },
    { code: "ru", label: "Russian" },
    { code: "hi", label: "Hindi" },
    { code: "pt-br", label: "Brazilian Portuguese" },
    { code: "ar", label: "Arabic" },
    { code: "ur", label: "Urdu" },
  ];

  const handleToggle = () => {
    setIsFavorite((prevState) => {
      setIsDoctorFavorite(false);
      const newState = !prevState;
      navigate(newState ? "/patient/FavClinic" : "/patient/allcliniclist");
      return newState;
    });
  };

  const handleDoctorToggle = () => {
    setIsDoctorFavorite((prevState) => {
      setIsFavorite(false);
      const newState = !prevState;
      navigate(newState ? "/patient/FavDoctor" : "/patient/allDoctorlist");
      return newState;
    });
  };

  // Load saved language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLang");
    if (savedLang) {
      i18n.changeLanguage(savedLang);
      setCurrentLang(savedLang.toUpperCase());
    }
  }, []);

  // Update currentLang when language changes
  useEffect(() => {
    setCurrentLang(i18n.language.toUpperCase());
  }, [i18n.language]);

  // Change Language and Save to localStorage
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("selectedLang", lang);
    setIsOpen(false);
  };

  return (
    <header>
      <div className="dashHead">
        <a href="#" className="logo">
          <img src="/images/logo.png" className="img-fluid" alt="Logo" />
          <a ref={sidebarColRef} className="sidebarcol" href="#">
            <img
              src="/images/sidebar-menu.svg"
              className="opening"
              alt="Toggle Sidebar"
            />
          </a>
        </a>
        <div className="dashRight">
          <div className="startStop">
            <img
              src="/images/doctor-dashboard/watch.png"
              className="img-fluid"
              alt="Watch"
            />
            {t("header.appointment-started")}
          </div>

          <div className="profileArea">
            {auth.user === "Doctor" && (
              <div className="wallet">
                <div className="img-wallet">
                  <img
                    src="/images/doctor-dashboard/wallet.svg"
                    className="img-fluid"
                    alt="Wallet"
                  />
                </div>
                <div className="paid">0$</div>
              </div>
            )}
            {auth.user === "Patient" && (
              <>
                <div onClick={handleToggle}>
                  <img
                    src={
                      isFavorite
                        ? "/images/user-dashboard/bookmark2.webp"
                        : "/images/bookmark.svg"
                    }
                    alt="Favorite Clinic"
                    className="iconWidth"
                  />
                </div>
                <div onClick={handleDoctorToggle}>
                  <img
                    src={
                      isDoctorFavorite
                        ? "/images/purple.svg"
                        : "/images/wishlist.svg"
                    }
                    alt="Favorite Doctor"
                    className="iconWidth"
                  />
                </div>
              </>
            )}

            <div className="profileBell">
              <a href="#">
                <img
                  src="/images/doctor-dashboard/bell.svg"
                  className="img-fluid"
                  alt="Bell"
                  onClick={toggleNotification}
                />
                {hasUnreadNotifications && (
                  <div className="notificationDot"></div>
                )}
                {isNotificationOpen && (
                  <NotificationDropdown
                    notifications={notifications}
                    onMarkAsRead={markNotificationAsRead}
                    onDeleteNotification={deleteNotification}
                  />
                )}
              </a>

              <div className={`profileImg ${getProfileClass(profileStatus)}`}>
                <img
                  src={isProfiledata?.profile_picture || "/images/globe.png"}
                  className="img-fluid profile1"
                  alt="Profile"
                />
              </div>
            </div>

            {auth.user === "Doctor" && (
              <div
                className="toggle"
                onClick={(event) => {
                  event.currentTarget.classList.toggle("active");
                  setIsActive(!isActive);
                }}
              >
                <div className="circle">
                  <img
                    src="/images/doctor-dashboard/phone.png"
                    alt="Phone"
                    className="img-fluid"
                  />
                </div>
                <span className="label">
                  {t("header.urgent")} <br />
                  {isActive ? "Call ON" : "Call OFF"}
                </span>
              </div>
            )}

            {/* Language Dropdown */}
            <div className="language">
              <div className="lang_select" onClick={() => setIsOpen(!isOpen)}>
                {currentLang}
              </div>
              {isOpen && (
                <ul className="langSubmenu">
                  {languages.map((lang) => (
                    <li
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                    >
                      <a href="#">{lang.label}</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
