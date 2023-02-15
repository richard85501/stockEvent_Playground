import axios from 'axios';
// import { logOut } from '../utils';

export async function sendApiRequest(method, url, payload, isImage, isMultiple) {
  const getCookie = `; ${document.cookie}`;
  const getToken = getCookie.split(`; token=`);
  // const token = getToken[1];
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoiMjAyMy0wMi0xNSAxMDo1NDo1NCIsInVzZXJfaWQiOiJ3aW53aW5jaGFuZyIsImlwIjoiMTE0LjM0LjE2My4yMTgifQ.yV-OUJtDnxHeXPOBCrlKXsc1SemuVyceH3o7ghLZ6cw';

  const settings = {
    method: method,
    url: import.meta.env.VITE_OPEN_API + url,
  };

  if (payload && isMultiple) {
    const formData = new FormData();

    Object.keys(payload).forEach((key) => {
      if (key === 'files') {
        if (payload[key]?.length > 0) {
          for (var i = 0; i < payload[key].length; i++) {
            formData.append(key + `[${i}]`, payload[key][i]);
          }
        }
      } else {
        if (Array.isArray(payload[key])) {
          formData.append(key, JSON.stringify(payload[key]));
        } else {
          formData.append(key, payload[key]);
        }
      }
    });

    settings.data = formData;
  }

  if (payload && isImage) {
    const formData = new FormData();

    Object.keys(payload).forEach((key) => {
      formData.append(key, payload[key]);
    });
    settings.data = formData;
  }

  if (payload && !isImage && !isMultiple) {
    settings.data = JSON.stringify(payload);
  }

  if ((token && isMultiple) || (token && isImage)) {
    settings.headers = {
      Accept: 'application/www-x-form-urlencoded',
      'Content-Type': 'application/www-x-form-urlencoded',
      Authorization: 'Bearer ' + token,
    };
  } else if (token && !isImage) {
    settings.headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    };
  } else {
    settings.headers = {
      'Content-Type': 'application/json',
    };
  }

  try {
    const res = await axios(settings);
    return res;
  } catch (err) {
    // if (err?.response) {
    //   console.error('error when calling api:', err?.response);
    //   if (err?.response?.status === 401) {
    //     logOut();
    //   }
    //   return err?.response;
    // } else {
    //   console.error('error when calling apis:', err);
    //   if (err?.response?.status === 403) {
    //     // logoutUser();
    //   } else {
    //     return err?.response;
    //   }
    // }
    throw err;
  }
}
