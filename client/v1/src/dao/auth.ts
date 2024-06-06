import Cookie from "js-cookie";

interface AuthFlowType {
  getAccessToken: string;
  setAccessToken: (value: string) => void;
  getRefreshToken: string;
  setRefreshToken: (value: string) => void;
}

export class AuthFlow implements AuthFlowType {
  public static instance: AuthFlow;

  constructor() {}

  private readonly ACCESS_TOKEN_KEY = "access_token";
  private readonly REFRESH_TOKEN_KEY = "refresh_token";

  static getInstance() {
    if (!this.instance) {
      this.instance = new AuthFlow();
    }
    return this.instance;
  }

  get isAuthenticated() {
    return this.getAccessToken;
  }

  get getAccessToken() {
    return Cookie.get(this.ACCESS_TOKEN_KEY) || "";
  }
  get getRefreshToken() {
    return Cookie.get(this.REFRESH_TOKEN_KEY) || "";
  }

  revokeTokens() {
    Cookie.remove(this.ACCESS_TOKEN_KEY);
    Cookie.remove(this.REFRESH_TOKEN_KEY);
  }

  setAccessToken(value: string) {
    Cookie.set(this.ACCESS_TOKEN_KEY, value, {
      expires: 1,
      secure: false,
      path: "/",
    });
  }

  setRefreshToken(value: string) {
    Cookie.set(this.REFRESH_TOKEN_KEY, value, {
      expires: 7,
      secure: false,
      path: "/",
    });
  }
}

export const AuthDao = AuthFlow.getInstance();
