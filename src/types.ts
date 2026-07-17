export interface FileTab {
    id: string;
    path: string;
    name: string;
    content: string;
    originalContent: string;
    language: string;
    isDirty: boolean;
}

export interface FsEntry {
    name: string;
    path: string;
    isDirectory: boolean;
    children?: FsEntry[];
    expanded?: boolean;
}