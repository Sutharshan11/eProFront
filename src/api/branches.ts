import axios from './axios';

export interface Branch {
    id: number;
    name: string;
    location: string;
    createdAt: string;
    _count?: {
        users: number;
        assets: number;
    }
}

export const getBranches = async () => {
    const response = await axios.get('/branches');
    return response.data;
};

export const getBranchById = async (id: number) => {
    const response = await axios.get(`/branches/${id}`);
    return response.data;
};

export const createBranch = async (data: Partial<Branch>) => {
    const response = await axios.post('/branches', data);
    return response.data;
};

export const updateBranch = async (id: number, data: Partial<Branch>) => {
    const response = await axios.put(`/branches/${id}`, data);
    return response.data;
};

export const deleteBranch = async (id: number) => {
    const response = await axios.delete(`/branches/${id}`);
    return response.data;
};
