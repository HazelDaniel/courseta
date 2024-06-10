import { Outlet, useLoaderData, useLocation, Navigate } from "react-router-dom";
import { RootWrapperStyled } from "./components/root-wrapper.styles";
import { SideTab } from "./components/side-tab";
import { Header } from "./components/header";
import type { AuthType } from "./types";

const App: React.FC<{ variant?: "side-tab" | "no-side-tab" }> = ({
  variant,
}) => {
  const location = useLocation();
  const paramsURL = new URLSearchParams(location.search);
  variant =
    variant ||
    (location.pathname.startsWith("/assessments/") &&
    paramsURL.get("course_id") &&
    paramsURL.get("lesson_id")
      ? "no-side-tab"
      : "side-tab");

  const loaderData: AuthType = useLoaderData() as AuthType;
  loaderData.token = "kjlfklsjfsdfs";
  loaderData.user = {
    avatarURL: "illustrations/avatar1.jpg",
    email: "hazeldaniel856@gmail.com",
    isLoggedIn: true,
    name: "daniel emmanuel",
    role: "student",
  };

  if (!loaderData.token) {
    return <Navigate to={"/auth?type=sign_in"} />;
  }
  console.log("current user is ", loaderData.user);

  return (
    <div id="app">
      {(() => {
        if (variant === "side-tab") {
          return (
            <div className="side-tab-wrapper">
              <SideTab />
            </div>
          );
        }
      })()}

      <RootWrapperStyled className={variant === "no-side-tab" ? "compact" : ""}>
        <Header variant={variant} user={loaderData.user} />
        <Outlet />
      </RootWrapperStyled>
    </div>
  );
};

export default App;
