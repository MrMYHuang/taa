import { Animal } from "./Animal";

export interface ShareTextModal {
    text: string;
    show: boolean;
}

export interface TmpSettings {
    fetchError: boolean;
    isLoading: boolean;
    shareTextModal: ShareTextModal;
    animals: Animal[];
}

export const defaultTmpSettings = {
    fetchError: false,
    isLoading: false,
    shareTextModal: { text: '', show: false },
    animals: [],
} as TmpSettings;
