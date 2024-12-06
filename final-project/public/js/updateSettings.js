/* eslint-disable */

import axios from 'axios';
import { displayAlert } from './alert';

export const updateSettings = async (data, type) => {
  try {
    const dataType =
      type.trim().toLowerCase().charAt(0).toUpperCase() + type.slice(1);
    const url = `/api/v1/users/${dataType === 'Password' ? 'updateMyPassword' : 'updateMe'}`;

    if (dataType !== 'Password' && dataType !== 'Data') {
      return displayAlert('error', 'Invalid type provided!');
    }

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    console.log(res);

    if (res.data.status === 'success') {
      displayAlert('success', `${dataType} updated successfully!`);
      // location.reload(true);
    }
  } catch (err) {
    displayAlert(
      'error',
      err.response?.data?.message || 'Error updating data!',
    );
  }
};
