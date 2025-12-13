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
