import axios from "axios";
import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  GET_ALL_CUSTOMERS_REQUEST,
  GET_ALL_CUSTOMERS_SUCCESS,
  GET_ALL_CUSTOMERS_FAILURE,
} from "./ActionTypes";
import { API_BASE_URL } from "../../config/api";

const getErrorMessage = (error) =>
  error.response && error.response.data.message
    ? error.response.data.message
    : error.message;

export const register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    if (data.jwt) localStorage.setItem("jwt", data.jwt);
    dispatch({ type: REGISTER_SUCCESS, payload: data.jwt });
    if (data.jwt) dispatch(getUser(data.jwt));
  } catch (error) {
    dispatch({ type: REGISTER_FAILURE, payload: getErrorMessage(error) });
  }
};

export const login = (userData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/signin`, userData);
    if (data.jwt) localStorage.setItem("jwt", data.jwt);
    dispatch({ type: LOGIN_SUCCESS, payload: data.jwt });
    if (data.jwt) dispatch(getUser(data.jwt));
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: getErrorMessage(error) });
  }
};

export const getAllCustomers = (token) => {
  return async (dispatch) => {
    console.log("jwt - ", token);
    dispatch({ type: GET_ALL_CUSTOMERS_REQUEST });
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch({ type: GET_ALL_CUSTOMERS_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: GET_ALL_CUSTOMERS_FAILURE, payload: error.message });
    }
  };
};

export const getUser = (token) => {
  return async (dispatch) => {
    dispatch({ type: GET_USER_REQUEST });
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch({ type: GET_USER_SUCCESS, payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: GET_USER_FAILURE, payload: error.message });
      return null;
    }
  };
};

export const deleteAddress = (addressId, jwt) => async (dispatch) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/users/addresses/${addressId}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    await dispatch(getUser(jwt));
    return true;
  } catch (error) {
    console.error("Delete address error:", error);
    return false;
  }
};

export const updateAddress = (addressId, addressData, jwt) => async (dispatch) => {
  try {
    await axios.put(
      `${API_BASE_URL}/api/users/addresses/${addressId}`,
      addressData,
      { headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" } }
    );
    await dispatch(getUser(jwt));
    return true;
  } catch (error) {
    console.error("Update address error:", error);
    return false;
  }
};

export const logout = () => async (dispatch) => {
  dispatch({ type: LOGOUT });
  localStorage.clear();
};
