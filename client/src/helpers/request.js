import axios from "axios";
const url = "/api/users";
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
}

export const getMethod = async (route) => {
  try {
    const res = await axios.get(route)
    return res
  } catch (err) {
    return err
  }
}

export const postMethod = async (formData, route) => {
  try {
    console.log('f', formData)
    const res = await axios.post(route, formData, headers)
    return res
  } catch (err) {
    return err
  }
}

export const deleteMethod = async (route) => {
  try {
    const res = await axios.delete(route);
    return res;
  } catch (err) {
    return err;
  }
}

export const patchMethod = async (route, formData) => {
  try {
    const res = await axios.patch(route, formData);
    return res;
  } catch (err) {
    return err;
  }
};