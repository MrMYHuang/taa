import { Animal } from "./Animal";

export class TmpSettings {
    fetchError: boolean = false;
    isLoading: boolean = false;
    shareTextModal = { text: '', show: false };
    animals: Animal[] = [];
}
