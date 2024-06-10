import { Form, Link, Location, useLocation, useSubmit } from "react-router-dom";
import { HeaderSearchBoxStyled, HeaderStyled } from "./header.styles";
import { useRef } from "react";
import { UserType } from "../types";

function calcHeaderVisible(location: Location) {
  let res: boolean = true;
  const pathString = location.pathname;
  res =
    pathString === "/dashboard/courses" ||
    pathString === "/dashboard/courses/" ||
    pathString.startsWith("/dashboard/courses?");

  res =
    res ||
    pathString === "/courses" ||
    pathString === "/courses/" ||
    pathString.startsWith("/courses?");

  return res;
}

const HeaderSearchBox: React.FC<{ dest: string }> = ({ dest }) => {
  const location = useLocation();
  const formRef = useRef<HTMLFormElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const submit = useSubmit();
  const existingSearch = new URLSearchParams(location.search);
  console.log(location.pathname);

  void dest;
  return (
    <Form
      action={location.pathname}
      onChange={(e: React.FormEvent) => {
        e.preventDefault();
        if (!searchInputRef.current) return;
        void e;
        submit(
          { search: searchInputRef.current.value.trim() },
          {
            action: location.pathname,
            encType: "application/x-www-form-urlencoded",
          }
        );
      }}
      ref={formRef}
    >
      <HeaderSearchBoxStyled>
        <input
          type="search"
          name="search"
          id=""
          ref={searchInputRef}
          defaultValue={existingSearch.get("search")}
        />

        <span className="search-icon">
          <input type="submit" value="" />
          <svg>
            <use xlinkHref="#search"></use>
          </svg>
        </span>
      </HeaderSearchBoxStyled>
    </Form>
  );
};

export const Header: React.FC<{
  variant: "side-tab" | "no-side-tab";
  user: UserType;
}> = ({ variant, user }) => {
  const location = useLocation();
  const isVisible = calcHeaderVisible(location);

  return (
    <HeaderStyled className={`${variant === "no-side-tab" ? "shrink" : ""}`}>
      <div className={isVisible ? "header-left" : "header-left hidden"}>
        <HeaderSearchBox dest={`${location.pathname}${location.search}`} />
      </div>
      <div className="header-right">
        <span className="notif-icon-area">
          <svg>
            <use xlinkHref="#bell"></use>
          </svg>
          <span className="notif-icon-shadow"></span>
        </span>
        <div className="profile-summary-area">
          <span className="summary-area-text">{`${
            user.email.split("@")[0]
          }`}</span>
          <div className="profile-image-div">
            <img
              src={user.avatarURL || "icons/user-icon.svg"}
              alt="avatar image of the user of the courseta platform"
              className="summary-area-image"
            />
            <Link to={"/dashboard"}></Link>
          </div>
        </div>
      </div>
    </HeaderStyled>
  );
};
