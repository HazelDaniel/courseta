import React from "react";
import { AuthStyled } from "./auth.styles";
import { Logo } from "../components/logo";
import { Form, Link, useLocation, useSubmit, Navigate } from "react-router-dom";
import { AuthDao } from "../dao/auth";

export const SignInForm: React.FC = () => {
  const signInSubmit = useSubmit();

  if (AuthDao.isAuthenticated) {
    return <Navigate to={"/"} replace={true} />;
  }
  return (
    <Form
      className="auth-form"
      method="post"
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        let email: string = (formData.get("email") as string) || "";
        let password: string = (formData.get("password") as string) || "";
        email = email.trim();
        password = password.trim();
        const res = { email, password };
        signInSubmit(res, {
          method: "POST",
          encType: "application/json",
        });
      }}
    >
      <div className="input-wrapper">
        <label htmlFor="auth-email">Email</label>
        <input type="email" name="email" id="auth-email" />
      </div>

      <div className="input-wrapper">
        <label htmlFor="auth-password">Password</label>
        <input type="password" name="password" id="auth-password" />
      </div>
      <button type="submit">SIGN IN</button>
    </Form>
  );
};

export const SignUpForm: React.FC = () => {
  if (AuthDao.isAuthenticated) {
    return <Navigate to={"/"} replace={true} />;
  }
  return (
    <Form className="auth-form">
      <div className="input-wrapper">
        <label htmlFor="auth-first-name">First Name</label>
        <input type="text" name="first_name" id="auth-first-name" />
      </div>

      <div className="input-wrapper">
        <label htmlFor="auth-last-name">Last Name</label>
        <input type="text" name="last_name" id="auth-last-name" />
      </div>

      <div className="input-wrapper">
        <label htmlFor="auth-email">Email</label>
        <input type="email" name="email" id="auth-email" />
      </div>

      <div className="input-wrapper breaker">
        <label htmlFor="auth-phone">Phone</label>
        <input type="tel" name="phone" id="auth-phone" />
      </div>

      <div className="input-wrapper">
        <label htmlFor="auth-password">Password</label>
        <input type="password" name="password" id="auth-password" />
      </div>
      <div className="input-wrapper">
        <label htmlFor="auth-confirm-password">Confirm Password</label>
        <input
          type="password"
          name="confirm_password"
          id="auth-confirm-password"
        />
      </div>

      <button type="submit">SIGN UP</button>
    </Form>
  );
};

type PossibleAuthTypes = "sign_in" | "sign_up";

export const Auth: React.FC = () => {
  const location = useLocation();
  const locationSearch = new URLSearchParams(location.search);
  const authType: PossibleAuthTypes = (locationSearch.get("type") ||
    "sign_up") as PossibleAuthTypes;
  return (
    <AuthStyled>
      <div className="auth-content-wrapper">
        <div className="auth-left">
          <div className="auth-logo-area">
            <Logo />
          </div>
          {authType === "sign_up" ? <SignUpForm /> : <SignInForm />}
        </div>
        <div className="auth-right">
          <p className="auth-right-header">
            <span></span>
            {authType === "sign_up" ? "or sign up using" : "or sign in using"}
            <span></span>
          </p>
          <ul>
            <li>
              <svg>
                <use xlinkHref="#google"></use>
              </svg>
              <Link to={`${location.pathname}${location.search}`}></Link>
            </li>

            <li>
              <svg>
                <use xlinkHref="#meta"></use>
              </svg>
              <Link to={`${location.pathname}${location.search}`}></Link>
            </li>

            <li>
              <svg>
                <use xlinkHref="#linkedin"></use>
              </svg>
              <Link to={`${location.pathname}${location.search}`}></Link>
            </li>

            <li>
              <svg>
                <use xlinkHref="#github"></use>
              </svg>
              <Link to={`${location.pathname}${location.search}`}></Link>
            </li>
          </ul>

          {authType === "sign_up" ? (
            <div className="auth-optional-redirect-area">
              <span>already have an account?</span>{" "}
              <Link to="/auth?type=login">login</Link>
            </div>
          ) : (
            <div className="auth-optional-redirect-area">
              <span>don't have an account?</span>
              <a
                href=""
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                }}
              >
                sign up
              </a>
            </div>
          )}
        </div>
      </div>
    </AuthStyled>
  );
};
