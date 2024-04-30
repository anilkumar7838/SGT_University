import { jwtDecode } from "jwt-decode";
import { url } from "./url";
export const isLoggedIn = async () => {
  try {
    if (localStorage.getItem("access_token")) {
      const payload = jwtDecode(localStorage.getItem("access_token"));
      if (payload && payload.exp && payload.exp >= Date.now() / 1000) {
        return true;
      }
    }
    const res = await fetch(`${url}/api/auth/isloggedin`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const { logged, access_token } = await res.json();
    localStorage.setItem("access_token", access_token);

    return logged;
  } catch (error) {
    try {
      const res = await fetch(`${url}/api/auth/isloggedin`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const { logged, access_token } = await res.json();
      localStorage.setItem("access_token", access_token);
      console.log(logged);
      return logged;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
};
