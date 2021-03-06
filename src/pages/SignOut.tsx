import { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { useHistory } from "react-router";
import userContext from "../context/userContext";
import { app } from "../utils/appwrite";

const SignOut = () => {
  const history = useHistory();
  const userC = useContext(userContext)
  useEffect(() => {
    const logout = async() => {
      await app.account.deleteSessions()
      localStorage.removeItem("sirius_user");
      userC.setUser(undefined);
      toast.success("Bye Bye");
      history.push("/");
      
    }
    if (userC.user !== undefined) logout()
  });
  return (
    <div className="bg-base-200 w-full h-full">
      <div className="hero min-h-full">
        <div className="text-center hero-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">We're sad to see you go</h1>
            <p className="mb-5">Signing out, please wait...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignOut;
