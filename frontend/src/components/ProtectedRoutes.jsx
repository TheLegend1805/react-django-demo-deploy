import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api.js";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants.js";
import { useEffect, useState } from "react";

function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  /**as soon as this component is called, we call up the auth() function
   * function checks validity of token, if couldnt it'll set to
   * unauthorized user.
   */
  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);
  
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      /**send a response to the route with refreshToken,
       * which in response shd give new access token*/
      const res = await api.post("/api/token/refresh/", {
        // here "refresh" is payload thts equal to refreshToken
        refresh: refreshToken,
      });

      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  /**auth fn => look at access token, check if expired, if expired
   * then automatically refresh the token
   */
  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (!token) {
      setIsAuthorized(false);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    //get the date in sec, so divide by 1000
    const todaysDate = Date.now() / 1000;

    /**if expiry of token is before today's date then refreshToken()
     * else the user is authorized
     */
    if (tokenExpiration < todaysDate) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  if (isAuthorized == null) return <div>Loading...</div>;

  /* if user is authorized then return the wrapped children components
     else navigate to login */
  return isAuthorized ? children : <Navigate to={"/login"} />;
}

export default ProtectedRoute;
