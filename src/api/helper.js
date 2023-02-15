import { sendApiRequest } from './api';

export async function sendGetRequest(url) {
  try {
    const response = await sendApiRequest('get', url);
    return response;
  } catch (err) {
    console.error('error when getting data:', err);
    throw err;
  }
}

export async function sendPostRequest(url, payload, isImage, isMultiple) {
  try {
    const response = await sendApiRequest('post', url, payload, isImage, isMultiple);
    return response.data;
  } catch (err) {
    console.error('error when posting data:', err);
    throw err;
  }
}

export async function sendPutRequest(url, payload, isImage) {
  try {
    const response = await sendApiRequest('put', url, payload);
    return response.data;
  } catch (err) {
    console.error('error when posting data:', err);
    throw err;
  }
}

export async function sendPatchRequest(url, payload, isImage) {
  try {
    const response = await sendApiRequest('patch', url, payload, isImage);
    return response.data;
  } catch (err) {
    console.error('error when posting data:', err);
    throw err;
  }
}

export async function sendDeleteRequest(url, payload) {
  try {
    const response = await sendApiRequest('delete', url, payload);
    return response.data;
  } catch (err) {
    console.error('error when posting data:', err);
    throw err;
  }
}
