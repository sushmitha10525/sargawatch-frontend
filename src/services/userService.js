// src/services/userService.js
import API from "./api";

export const getUserProfile = () => API.get("/user/profile");
export const getSavedItems = () => API.get("/user/saved");
