import { json, type LoaderFunctionArgs } from "react-router-dom";
import { AuthType, DBUserType } from "../types";
import { AuthDao } from "../dao/auth";
import axios from "axios";
import { BASE_URL } from "../config";
import { transformUserProfile } from "../transformers";

export const rootLoader: (
  args: LoaderFunctionArgs
) => Promise<Response> | never = async (args) => {
  try {
    const { request } = args;
    void request;
    const res: Partial<AuthType> = {};
    const authToken = AuthDao.getAccessToken;
    res.token = authToken || null;
    if (authToken) {
      const response = await axios.get(`${BASE_URL}/auth/me`);
      if (response.status === 200) {
        const user: DBUserType = response.data;
        res.user = transformUserProfile(user);
      }
    }
    return json(res as AuthType);
  } catch (err) {
    throw new Response("internal server error", { status: 500 });
  }
};
