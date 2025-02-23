import API from "../utils/api.js";
const Logout = async () => {
  try {
    await API.post("/users/logout");
    setIsAuthenticated(false);
    navigate("/login");
  } catch (err) {
    console.error("Logout failed");
  }
};

export default Logout;
