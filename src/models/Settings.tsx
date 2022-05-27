export interface Settings {
    version: number;
    hasAppLog: boolean;
    theme: number;
    uiFontSize: number;
    textFontSize: number;
    dbUpdateDate: string;
    bookmarks: number[];
}

export const defaultSettings = {
    version: 1,
    hasAppLog: true,
    theme: 3,
    uiFontSize: 18,
    textFontSize: 18,
    dbUpdateDate: '',
    bookmarks: [],
} as Settings;
