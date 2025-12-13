import axios from './axios';

export interface TransferRequest {
    id: number;
    assetId: number;
    fromBranchId: number;
    toBranchId: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    requestDate: string;
    reason: string;
    remarks?: string;
    asset: {
        name: string;
        assetId: string;
    };
    fromBranch: {
        name: string;
    };
    toBranch: {
        name: string;
    };
}

export const getTransferRequests = async () => {
    const response = await axios.get('/transfers');
    return response.data;
};

export const requestTransfer = async (data: { assetId: number, toBranchId: number, reason: string }) => {
    const response = await axios.post('/transfers', data);
    return response.data;
};

export const updateTransferStatus = async ({ id, status, remarks }: { id: number, status: 'APPROVED' | 'REJECTED', remarks?: string }) => {
    const response = await axios.put(`/transfers/${id}/status`, { status, remarks });
    return response.data;
};
