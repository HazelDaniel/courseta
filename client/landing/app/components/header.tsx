import headerStyle from "~/styles/header.module.css";
import { Link } from "@remix-run/react";

export const Header: React.FC = () => {
  return (
    <header className={headerStyle.header}>
      <div className={headerStyle["logo_parent"]}>
        <img
          src="/logo.svg"
          alt="the logo of the ed-tech platform, courseta. courseta ed-tech logo"
        />
      </div>
      <div className={headerStyle["header_child"]}>
        <nav className={headerStyle["header_links_area"]}>
          <ul>
            <li>
              <Link to="">home</Link>
            </li>
            <li>
              <Link to="">about us</Link>
            </li>
            <li>
              <Link to="">vision</Link>
            </li>
            <li>
              <Link to="">testimonials</Link>
            </li>
          </ul>
        </nav>

        <div className={headerStyle["header_cta_area"]}>
          <button
            className={
              headerStyle["btn_secondary"] + " " + headerStyle["header_btn"]
            }
          >
            be a creator
          </button>
          <button
            className={
              headerStyle["btn_primary"] + " " + headerStyle["header_btn"]
            }
          >
            be a student
          </button>
        </div>
      </div>
    </header>
  );
};
