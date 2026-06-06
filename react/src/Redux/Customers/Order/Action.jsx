import axios from "axios";
import {
  CREATE_ORDER_FAILURE, CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS,
  GET_ORDER_BY_ID_FAILURE, GET_ORDER_BY_ID_REQUEST, GET_ORDER_BY_ID_SUCCESS,
  GET_ORDER_HISTORY_FAILURE, GET_ORDER_HISTORY_REQUEST, GET_ORDER_HISTORY_SUCCESS,
} from "./ActionType";
import api, { API_BASE_URL } from "../../../config/api";
import { getCart } from "../Cart/Action";

export const createOrder = (reqData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_ORDER_REQUEST });
    const config = {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${reqData.jwt}` },
    };
    const { data } = await axios.post(`${API_BASE_URL}/api/orders/`, reqData.address, config);
    const createdOrder = data?.order || data?.data || data;
    dispatch({ type: CREATE_ORDER_SUCCESS, payload: createdOrder });
    dispatch(getCart(reqData.jwt));
    // Trả về order data để component tự navigate
    if (reqData.onSuccess) reqData.onSuccess(createdOrder);
    return createdOrder;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch({
      type: CREATE_ORDER_FAILURE,
      payload: message,
    });
    if (reqData.onError) reqData.onError(message);
    return null;
  }
};

export const getOrderById = (orderId) => async (dispatch) => {
  try {
    if (!orderId || orderId === "undefined" || orderId === "null") {
      dispatch({ type: GET_ORDER_BY_ID_FAILURE, payload: "Khong tim thay ma don hang." });
      return null;
    }
    dispatch({ type: GET_ORDER_BY_ID_REQUEST });
    const { data } = await api.get(`/api/orders/${orderId}`);
    dispatch({ type: GET_ORDER_BY_ID_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch({ type: GET_ORDER_BY_ID_FAILURE, payload: error.response?.data?.message || error.message });
    return null;
  }
};

export const getOrderHistory = (reqData) => async (dispatch) => {
  try {
    dispatch({ type: GET_ORDER_HISTORY_REQUEST });
    const { data } = await api.get(`/api/orders/user`);
    dispatch({ type: GET_ORDER_HISTORY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_ORDER_HISTORY_FAILURE, payload: error.response?.data?.message || error.message });
  }
};

export const cancelOrder = (orderId) => async (dispatch) => {
  try {
    dispatch({ type: "CANCEL_ORDER_REQUEST" });
    const { data } = await api.put(`/api/orders/${orderId}/cancel`);
    dispatch({ type: "CANCEL_ORDER_SUCCESS", payload: data });
    dispatch(getOrderHistory({ jwt: localStorage.getItem("jwt") }));
    return true;
  } catch (error) {
    dispatch({ type: "CANCEL_ORDER_FAILURE", payload: error.response?.data?.message || error.message });
    return false;
  }
};
