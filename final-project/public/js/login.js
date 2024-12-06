/* eslint-disable */
import axios from 'axios';
import { displayAlert } from './alert';

export const signup = async (name, email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      displayAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    displayAlert('error', err.response.data.message);
  }
};

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      displayAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    displayAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
      // location.reload(true);
    }
  } catch (err) {
    console.log(err);
    displayAlert('error', 'Error Logged Out! Try Again!');
  }
};
