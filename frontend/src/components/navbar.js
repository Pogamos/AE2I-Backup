import React, { useState } from "react";

function Navbar({ setStyleMarginLeft }) {
  const [expanded, setExpanded] = useState(false);
  const [styleWidth, setStyleWidth] = useState({ width: "100px" });

  function openNav() {
    setExpanded(true);
    setStyleWidth({ width: "200px" });
    setStyleMarginLeft({ marginLeft: "200px" });
  }

  function closeNav() {
    setExpanded(false);
    setStyleWidth({ width: "100px" });
    setStyleMarginLeft({ marginLeft: "100px" });
  }

  document.addEventListener("DOMContentLoaded", function () {
    // chemin URL
    const currentPath = window.location.pathname;

    // Recupere toutes les balises <a> dans le conteneur de navigation
    const navLinks = document.querySelectorAll(
      ".nav_item_container a, .account_container a"
    );

    navLinks.forEach((link) => {
      // extrait le chemin du lien
      const linkPath = new URL(
        link.getAttribute("href"),
        window.location.origin
      ).pathname;

      console.log(
        "navbar : ",
        linkPath,
        " url : ",
        currentPath,
        "equal : ",
        linkPath === currentPath
      );
      if (linkPath === currentPath) {
        link.classList.add("selected");
      }
    });
  });

  return (
    <div
      id="mySidenav"
      className={expanded ? "sidenav expanded" : "sidenav collapsed"}
      style={styleWidth}
      onMouseOver={openNav}
      onMouseOut={closeNav}
    >
      <div style={{ height: "155px" }}>
        <div className="logo-container" href="/">
          <img
            src="../../svg/ae2i-logo_dark.svg"
            alt="Logo"
            id="ae2i-logo"
            className="navbar-logo"
          />
        </div>
      </div>
      <div className="nav_item_container">
        <a href="/events" class="nav_item">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6 0C2.68629 0 0 2.68629 0 6V25.9956C0 29.3093 2.68629 31.9956 6 31.9956H26C29.3137 31.9956 32 29.3093 32 25.9956V6C32 2.68629 29.3137 0 26 0H6ZM7.5 6V4C7.5 3.17157 8.17157 2.5 9 2.5C9.82843 2.5 10.5 3.17157 10.5 4V6H21.5V4C21.5 3.17157 22.1716 2.5 23 2.5C23.8284 2.5 24.5 3.17157 24.5 4V6H25C26.1046 6 27 6.89543 27 8V14H5V8C5 6.89543 5.89543 6 7 6H7.5Z"
              fill="white"
              fill-opacity="0.5"
            />
            <rect
              x="5"
              y="18"
              width="10.24"
              height="7.67894"
              rx="1"
              fill="#D91663"
              fill-opacity="0.5"
            />
          </svg>
          &nbsp;
          <span className="nav_text">À LA UNE</span>
        </a>
        <a href="/shop" className="nav_item">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6 0C2.68629 0 0 2.68629 0 6V26C0 29.3137 2.68629 32 6 32H26C29.3137 32 32 29.3137 32 26V6C32 2.68629 29.3137 0 26 0H6ZM22.3704 5.96899C23.1325 5.16937 24.3984 5.13888 25.198 5.9009C25.9977 6.66292 26.0282 7.92889 25.2661 8.72851C22.6475 11.4764 19.4913 12.9933 16.1639 12.9933C12.843 12.9933 9.65124 11.4825 6.9486 8.757C6.17085 7.97268 6.17617 6.70636 6.96049 5.9286C7.74482 5.15084 9.01114 5.15617 9.7889 5.9405C11.9049 8.0744 14.1226 8.99328 16.1639 8.99328C18.1989 8.99328 20.3582 8.08052 22.3704 5.96899Z"
              fill="white"
              fill-opacity="0.5"
            />
            <rect
              x="19.3125"
              y="23.4424"
              width="7.72477"
              height="3.86238"
              rx="1"
              fill="#D91663"
              fill-opacity="0.5"
            />
          </svg>
          &nbsp;
          <span className="nav_text">BOUTIQUE</span>
        </a>
        <a href="/polls" className="nav_item">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0 6C0 2.68629 2.68629 0 6 0H26C29.3137 0 32 2.68629 32 6V26C32 29.3137 29.3137 32 26 32H6C2.68629 32 0 29.3137 0 26V6ZM5 7C5 6.44772 5.44772 6 6 6H10C10.5523 6 11 6.44772 11 7V27C11 27.5523 10.5523 28 10 28H8C6.34315 28 5 26.6569 5 25V7ZM14 10C13.4477 10 13 10.4477 13 11V27C13 27.5523 13.4477 28 14 28H17C17.5523 28 18 27.5523 18 27V11C18 10.4477 17.5523 10 17 10H14Z"
              fill="white"
              fill-opacity="0.5"
            />
            <rect
              x="21"
              y="4"
              width="7"
              height="7"
              rx="2"
              fill="#D91663"
              fill-opacity="0.5"
            />
          </svg>
          &nbsp;
          <span className="nav_text">SONDAGE</span>
        </a>
        <a href="/team" className="nav_item">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0 5.99963C0 2.68593 2.68629 -0.000366211 6 -0.000366211H26C29.3137 -0.000366211 32 2.68593 32 5.99963V25.9996C32 29.3133 29.3137 31.9996 26 31.9996H6C2.68629 31.9996 0 29.3133 0 25.9996V5.99963ZM6.4 7.11963C6.4 6.01506 7.29543 5.11963 8.4 5.11963H12.7478C13.8524 5.11963 14.7478 6.01506 14.7478 7.11963V11.4675C14.7478 12.572 13.8524 13.4675 12.7478 13.4675H8.4C7.29543 13.4675 6.4 12.572 6.4 11.4675V7.11963ZM18 15.3046C19.6569 15.3046 21 16.6478 21 18.3046V24.8264C21 26.4832 19.6569 27.8264 18 27.8264H8.17424C5.9651 27.8264 4.17424 26.0355 4.17424 23.8264V18.3046C4.17424 16.6478 5.51739 15.3046 7.17424 15.3046H18Z"
              fill="white"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M18.0864 15.3031C19.7035 15.3486 21.0004 16.6738 21.0004 18.3019V24.8236C21.0004 26.4517 19.7035 27.7769 18.0864 27.8224V27.8236H23.8256C26.0347 27.8236 27.8256 26.0328 27.8256 23.8236V18.3019C27.8256 16.645 26.4824 15.3019 24.8256 15.3019H18.0864V15.3031Z"
              fill="#D91663"
            />
            <rect
              x="19.2002"
              y="6.39966"
              width="6.95652"
              height="6.95652"
              rx="2"
              fill="#D91663"
            />
          </svg>
          &nbsp;
          <span className="nav_text">L'AE2I</span>
        </a>
      </div>
      <div className="account_container">
        <a href="/myaccount" className="nav_item">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6 0C2.68629 0 0 2.68629 0 6V26C0 29.3137 2.68629 32 6 32H26C29.3137 32 32 29.3137 32 26V6C32 2.68629 29.3137 0 26 0H6ZM19.7713 8.25169L18.4962 7.54332L17.4321 8.54093C15.1072 10.7205 13.5585 11.6747 12.1291 12.0406C10.7152 12.4024 9.12677 12.2647 6.51586 11.5677C5.44866 11.2828 4.35257 11.9169 4.06767 12.9841C3.78277 14.0513 4.41695 15.1474 5.48414 15.4323C8.27323 16.1769 10.6848 16.5392 13.1209 15.9156C15.2001 15.3835 17.0805 14.1895 19.1381 12.3928C20.2286 12.8553 21.3285 13.125 22.475 13.125C24.0945 13.125 25.5749 12.5875 27.029 11.715C27.9762 11.1467 28.2833 9.91817 27.715 8.97101C27.1467 8.02385 25.9182 7.71672 24.971 8.28501C23.9251 8.91255 23.1555 9.125 22.475 9.125C21.7812 9.125 20.9459 8.90423 19.7713 8.25169ZM17 17C18.1046 17 19 17.8954 19 19V22C19 23.1046 18.1046 24 17 24C15.8954 24 15 23.1046 15 22V19C15 17.8954 15.8954 17 17 17ZM26 19C26 17.8954 25.1046 17 24 17C22.8954 17 22 17.8954 22 19V22C22 23.1046 22.8954 24 24 24C25.1046 24 26 23.1046 26 22V19Z"
              fill="#D9D9D9"
            />
            <rect x="8" y="24" width="5" height="3" rx="1.5" fill="#D91663" />
            <rect x="26" y="24" width="4" height="3" rx="1.5" fill="#D91663" />
          </svg>
          &nbsp;
          <span className="nav_text">MON PROFIL</span>
        </a>
      </div>
      <div className="account_container">
        <span className="footer">
          {" "}
          ©copyright | association AE2i | Tout droits réservés{" "}
        </span>
      </div>
    </div>
  );
}

export default Navbar;
