import axios from './axios';

export const changePassword = async (data: { oldPassword: string; newPassword: string }) => {
    const response = await axios.post('/auth/change-password', data);
    return response.data;
};

export const forgotPassword = async (email: string) => {
    const response = await axios.post('/auth/forgot-password', { email });
    return response.data;
};

export const resetPassword = async (data: { token: string; newPassword: string }) => {
    const response = await axios.post('/auth/reset-password', data);
    return response.data;
};
