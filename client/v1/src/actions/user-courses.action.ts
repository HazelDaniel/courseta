import { LoaderFunctionArgs, json } from "react-router-dom";

export const userCoursesAction: (
  args: LoaderFunctionArgs
) => Promise<Response> = async (args) => {
  const { request } = args;
  const requestBody = await request.json();
  console.log("action getting hit by a ", request.method, "method");
  // const formdata: FormData | null =
  //   request.method === "POST" ? await request.formData() : null;
  // let searchTerm: string | null;
  // if (formdata) {
  //   console.log(Object.fromEntries(formdata));
  //   searchTerm = formdata.get("search") as string;
  //   console.log("search term is ", searchTerm);
  // }
  console.log(requestBody);
  return json({});
};
