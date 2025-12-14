import axios from './axios';

export interface Asset {
    id: number;
    assetId: string;
    assetCode?: string;
    name: string;
    category: string;
    status: 'Active' | 'Damaged' | 'Disposed' | 'In Use';
    value: number;
    branchId: number;
    branch?: { name: string };

    // Relations
    center?: { name: string };
    section?: { name: string };
    assetType?: { name: string };

    // Details
    quantity: number;
    inventoryPageNo?: string;
    purchaseDate?: string;
    purchasePrice?: number;
    grnNumber?: string;
    remarks?: string;
    revaluationPrice?: number;
    transferredToConsumable?: boolean;
    currentLocation?: string;
    newSection?: string;

    // BOS
    boardOfSurveyCategory?: { name: string; code: string };
    boardOfSurveyYear?: { year: number };

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

export const updateAsset = async (id: number, data: Partial<Asset>) => {
    const response = await axios.put(`/assets/${id}`, data);
    return response.data;
};

export const deleteAsset = async (id: number, reason: string) => {
    const response = await axios.delete(`/assets/${id}`, { data: { reason } });
    return response.data;
};

export const getNextAssetId = async (category: string) => {
    const response = await axios.get(`/assets/next-code?category=${encodeURIComponent(category)}`);
    return response.data.nextCode;
};

export const restoreAsset = async (id: number) => {
    const response = await axios.patch(`/assets/${id}/restore`);
    return response.data;
};

export const getAssetHistory = async (id: number) => {
    const response = await axios.get(`/assets/${id}/history`);
    return response.data;
};

export const getBoardOfSurveyMasterData = async () => {
    const response = await axios.get('/assets/master-data');
    return response.data;
};
