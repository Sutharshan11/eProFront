import axios from './axios';

export interface Asset {
    id: number;
    assetId: string;
    name: string;
    category: string;
    status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'DISPOSED';
    value: number;
    branchId: number;
    branch?: { name: string };
    createdAt: string;
}

export const getAssets = async (filters?: { branchId?: number }) => {
    const params = new URLSearchParams();
    if (filters?.branchId) params.append('branchId', filters.branchId.toString());

    const response = await axios.get(`/assets?${params.toString()}`);
    return response.data;
};

export const createAsset = async (data: Omit<Asset, 'id' | 'createdAt' | 'branch'>) => {
    const response = await axios.post('/assets', data);
    return response.data;
};
