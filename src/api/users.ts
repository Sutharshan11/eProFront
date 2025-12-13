import axios from './axios';

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'SUPER_ADMIN' | 'ADMIN' | 'BRANCH_MANAGER' | 'STAFF';
    branch?: { name: string };
    createdAt: string;
}

export const getUsers = async () => {
    const response = await axios.get('/users');
    return response.data;
};

export const createUser = async (data: any) => {
    const response = await axios.post('/users', data);
    return response.data;
};

export const updateUserRole = async (userId: number, role: string) => {
    const response = await axios.put(`/users/${userId}/role`, { role });
    return response.data;
};

export const deleteUser = async (userId: number) => {
    const response = await axios.delete(`/users/${userId}`);
    return response.data;
};
