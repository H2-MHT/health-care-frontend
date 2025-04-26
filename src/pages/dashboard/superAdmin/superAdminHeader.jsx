// import React, { useState, useEffect, useMemo } from "react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import "../doctor-dashboard/header/header.css";
import { useTranslation } from "react-i18next";

export const SuperAdminHeader = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language.toUpperCase());
  const sidebarColRef = useRef(null);
  const sidebarmenuRef = useRef(null);

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

 
  const languages = [
    { code: "en", label: "English" },
    { code: "fr", label: "French" },
    { code: "es", label: "Spanish" },
  ];

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
          <div className="sidebarmenu">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <a ref={sidebarColRef} className="sidebarcol" href="#">
        <img
          src="/images/sidebar-menu.svg"
          className="opening"
          alt="Toggle Sidebar"
        />
      </a>
        </a>
        <div className="dashRight">
        
          {/* <div className="startStop">
            <img
              src="/images/doctor-dashboard/watch.png"
              className="img-fluid"
              alt="Watch"
            />
            Appointment Just STARTED
          </div> */}

          <div className="profileArea">
            {/* <div className="wallet">
              <div className="img-wallet">
                <img
                  src="/images/doctor-dashboard/wallet.svg"
                  className="img-fluid"
                  alt="Wallet"
                />
              </div>
              <div className="paid">0$</div>
            </div>
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
                />
              </a>

              <div className="profileImg">
                <img
                  src={isProfiledata?.profile_picture || "/images/globe.png"}
                  className="img-fluid profile1"
                  alt="Profile"
                />
              </div>
            </div>

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
                Urgent <br />
                {isActive ? "Call ON" : "Call OFF"}
              </span>
            </div> */}

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
