import type { FsEntry } from "../types";
import { open } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile, readDir } from "@tauri-apps/plugin-fs";

export async function pickFolder(): Promise<string | null> {
    const selected = await open({ directory: true, multiple: false });
    return typeof selected === "string" ? selected : null;
}

export async function pickFile(): Promise<string | null> {
    const selected = await open({ directory: false, multiple: false });
    return typeof selected === "string" ? selected : null;
}

export async function listDir(path: string): Promise<FsEntry[]> {
    const entries = await readDir(path);
    return entries
        .map((e) => ({
            name: e.name ?? "",
            path: `${path}/${e.name}`,
            isDirectory: e.isDirectory,
        }))
        .sort((a, b) => {
            if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
            return a.name.localeCompare(b.name);
        });
}

export async function readFile(path: string): Promise<string> {
    return await readTextFile(path);
}

export async function writeFile(path: string, content: string): Promise<void> {
    await writeTextFile(path, content);
}

export function languageFromPath(path: string): string {
    const ext = path.split(".").pop()?.toLowerCase();
    const map: Record<string, string> = {
        py: "python",
        js: "javascript",
        jsx: "javascript",
        ts: "typescript",
        tsx: "typescript",
        cpp: "cpp",
        cc: "cpp",
        h: "cpp",
        hpp: "cpp",
        c: "c",
        rs: "rust",
        json: "json",
        md: "markdown",
        html: "html",
        css: "css",
        mello: "python",
    };
    return map[ext ?? ""] ?? "plaintext";
}