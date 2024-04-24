import axios from "axios";
import { User } from "../User/client";
axios.defaults.withCredentials = true;

export const BASE_API = process.env.REACT_APP_API_BASE;
export const ADMIN_API = `${BASE_API}/api/admin`;


export const createBrew = async (brew: any) => {
    const response = await axios.post(`${ADMIN_API}/breweries`, brew);
    return response.data;
};

export const updateBrew = async (brewId: any, brew: any) => {
    const response = await axios.put(`${ADMIN_API}/breweries/${brewId}`, brew);
    return response.data;
};

export const updateReviewsForBrew = async (brewId: any, reviewObj: any) => {
    const response = await axios.put(`${ADMIN_API}/breweries/reviews/${brewId}`, reviewObj);
    return response.data;
};

export const deleteBrew = async (brew: any) => {
    const response = await axios.delete(
        `${ADMIN_API}/breweries/${brew._id}`);
    return response.data;
};

export const findAllBrews = async () => {
    const response = await axios.get(`${ADMIN_API}/breweries`);
    return response.data;
};

export const findBrewById = async (id: String) => {
    const response = await axios.get(`${ADMIN_API}/breweries/${id}`);
    return response.data;
};

export const findBrewsByName = async (name: String) => {
    const response = await axios.get(`${ADMIN_API}/breweries/name/${name}`);
    return response.data;
};

export const sortBrewByLikes = async (count: Number) => {
    const response = await axios.get(`${ADMIN_API}/breweries/likes/`+ count);
    return response.data;
};

export const sortBrewByFollowers = async (count: Number) => {
    const response = await axios.get(`${ADMIN_API}/breweries/followers/`+ count);
    return response.data;
};

export const findReviewsByUserId = async (userId: String) => {
    const response = await axios.get(`${ADMIN_API}/breweries/reviews/${userId}`);
    return response.data;
};

export const findRandomBrews = async (num : Number) => {
    const response = await axios.get(`${ADMIN_API}/breweries/random/`+ num);
    return response.data;
};

export const findBrewForOwner = async (usr : User) => {
    const response = await axios.get(`${BASE_API}/api/users/${usr._id}/claims`);
    return response.data;
};

export const findUserFromFollowers = async (brId : any, userId: String) => {
    const response = await axios.get(`${ADMIN_API}/breweries/${brId}/follow/${userId}`);
    return response.data;
};

export const findUserFromLikers = async (brId : any, userId: String) => {
    const response = await axios.get(`${ADMIN_API}/breweries/${brId}/like/${userId}`);
    return response.data;
};






