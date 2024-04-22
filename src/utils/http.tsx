import { Store } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { logout } from '../store/slices/adminSlice';

let store: Store;

export const injectStore = (_store: Store) => {
  store = _store;
};

export const defaultHttp = axios.create();
const http = axios.create();

http.interceptors.request.use(
  (config) => {
    const state: RootState = store.getState();
    const apiToken = state.admin?.token;

    if (apiToken) {
      config.headers.Authorization = `Bearer ${apiToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    if(!response?.data?.error){
      return response;
    }
    console.log(response);
    
    throw Error(response?.data?.message)
  },
  (error) => {
    if (error?.response?.status === 401) {
      store.dispatch(logout());
      return Promise.reject('Phiên đăng nhập hết hạn');
    }
    else if(error?.response?.status === 400){
      return Promise.reject('Dữ liệu không hợp lệ');
    }
    return Promise.reject(error);
  }
);

export default http;
