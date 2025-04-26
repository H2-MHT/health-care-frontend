import React, { useState,useEffect, useRef } from "react";
import "./header.css";
import { useNavigate,Link } from "react-router-dom";
import Image from "../../form/Image";
import { useTranslation } from "react-i18next";


const Header = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("login");
  // const [isOpen, setIsOpen] = useState(false); // State to manage dropdown visibility
  const [currentLang, setCurrentLang] = useState("en");
  const [isNavbarOpen,setIsNavbarOpen]=useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false); // State to manage dropdown visibility

  const dropdownRef = useRef(null); // Language Dropdown
  const navbarRef = useRef(null); // Navbar Dropdown reference

  const languages = [
    { code: "en", label: "English" },
    { code: "fr", label: "French" },
    { code: "es", label: "Spanish" },
  ];

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen((prev) => !prev); // Toggle the dropdown visibility
  };

  const toggleNavbarDropdown = ()=>{
    setIsNavbarOpen(!isNavbarOpen);
  }
  // const toggleDropdown = (event) => {
  //   event.stopPropagation();
  //   setIsOpen((prev) => !prev); // Toggle the dropdown visibility
  // };

 useEffect(() => {
    const savedLang = localStorage.getItem("selectedLang");
    console.log(savedLang,">>>>>>>>>>")
    if (savedLang) {
      i18n.changeLanguage(savedLang);
      setCurrentLang(savedLang.toUpperCase());
    }
  }, []);

  // Update currentLang when i18n language changes
  useEffect(() => {
    setCurrentLang(i18n.language.toUpperCase());
  }, [i18n.language]);

  //  Change Language and Save to localStorage
  const changeLanguage = (lang) => {
    console.log(lang,">>>>>>>>>>>")
    i18n.changeLanguage(lang);
    localStorage.setItem("selectedLang", lang);
    setIsLanguageDropdownOpen(false); // Close dropdown after selection
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      //Close Language Dropdown if clicked outside
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false);
      }
      // console.log('navbar ', isNavbarOpen);
      // console.log('navbarref ', navbarRef.current);
      // console.log('navbarref contains', navbarRef.current.contains(event.target));
      // console.log('event ',event.target);
      
      
      // Close Navbar if clicked outside
      if (isNavbarOpen && navbarRef.current && !navbarRef.current.contains(event.target) && !event.target.closest(".hamburger"))
        setIsNavbarOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNavbarOpen]);


  return (
    <header>
      <div className="container">
        {/* <div className="mobile_topbar">
          * ! <div className="logPrt">
            <a href="#" className="login_icn">
              <Image src="/images/login.png" alt="login" />  {t("login.login_button")}
            </a>
            <a href="#" className="blue_btn">
              {t("ui_header.register_now")}
            </a>
            <a href="#" className="search">
              <Image src="/images/search.png" alt="search" />
            </a>
          </div>

          <div className="language" ref={dropdownRef}>
            <div className="lang_select" onClick={toggleDropdown}>
              // <div className="lang_select" onClick={toggleLanguageDropdown}>

               {t("ui_header.hn_lable")}
            </div>
            {isLanguageDropdownOpen && (
              <ul className="langSubmenu">
                {languages.map((lang) => (
                  <li key={lang.code}>
                    <a href="#">{lang.code}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div> */}

        <div className="top_bar">
          <a href="#" className="logo-link">
            <div className="logo">
              <Image src="/images/logo.svg" alt="logo" className="img-fluid" />
            </div>
          </a>

          <nav ref={navbarRef} className={`navbar ${isNavbarOpen ? "open" : ""}`}>
            <ul className="navbar-items">
              <li>
                <Link to="https://www.my-health.today/">{t("ui_header.home_lable")}</Link>
                {/* <a href= target="blank"></a> */}
              </li>
              <li>
                <Link to="#">{t("ui_header.myApp_guest")}</Link>
              </li>
              <li>
                <Link to="/alldoctors">{t("ui_header.find_doctor")}</Link>
              </li>
              <li>
                <Link to="/allclinics">{t("ui_header.clinics_lable")}</Link>
              </li>
              <li>
                <Link to="https://www.my-health.today/">{t("ui_header.about_us")}</Link>
              </li>
              <li>
                <Link to="https://www.my-health.today/">{t("ui_header.contact_us")}</Link>
              </li>
            </ul>
          </nav>

          <div className="right_side">
            <div className="logPrt">
              <a onClick={() => navigate("/login")} className="login_icn">
                <Image src="/images/login.png" alt="login" />{t("login.login_button")} 
              </a>
              <a className="blue_btn" onClick={() => navigate("/signup")}>
                {t("ui_header.register_now")}
              </a>
              {/* <a href="#" className="search">
                <Image src="/images/search.png" alt="search" />
              </a> */}
            </div>

            <div className="language" ref={dropdownRef}>
              {/* Language Dropdown */}
              <div className="lang_select" onClick={toggleLanguageDropdown}>
                {currentLang}
              </div>
              {isLanguageDropdownOpen && (
                <ul className="langSubmenu" onClick={(e) => e.stopPropagation()}>
                  {languages.map((lang) => (
                    <li key={lang.code} onClick={() => changeLanguage(lang.code)}>
                      <a href="#">{lang.label}</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className={`hamburger ${isNavbarOpen ? "open" : ""}`} onClick={toggleNavbarDropdown}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;




