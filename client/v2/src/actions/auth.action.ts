import { LoaderFunctionArgs, json, redirect } from "react-router-dom";
import { BASE_URL, updateInterceptorWithToken } from "../config";
import { AuthDao } from "../dao/auth";
import axios from "axios";

type AuthResolveType = {
  refresh: string;
  access: string;
};

// TODO: don't forget to add form validation logic here
export const authAction: (
  args: LoaderFunctionArgs
) => Promise<Response> = async (args) => {
  const { request } = args;
  const requestBody = await request.json();
  // console.log("action getting hit by a ", request.method, "method");
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/token`,
      JSON.stringify(requestBody),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 401) {
      console.log(" response status is ", response.status);
      throw new Response("user not authenticated", { status: 401 });
    } else if (response.status === 200) {
      const body: AuthResolveType = await response.data;
      AuthDao.setAccessToken(body.access);
      AuthDao.setRefreshToken(body.refresh);
      updateInterceptorWithToken();
      return redirect("/", {status: 200});
    } else {
      throw response;
    }
  } catch (err) {
    console.error(
      "an error occurred while trying to submit the authentication credentials",
      err
    );
  }
  // const formdata: FormData | null =
  //   request.method === "POST" ? await request.formData() : null;
  // console.log("form data is ", formdata);
  // let searchTerm: string | null;
  // if (formdata) {
  //   console.log(Object.fromEntries(formdata));
  //   searchTerm = formdata.get("search") as string;
  //   console.log("search term is ", searchTerm);
  // }
  console.log(" request  body is ", requestBody);
  return json({});
};
