import { useState } from "react";
import { listDirRecursive } from "../lib/fs";
import type { FsEntry } from "../types";
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen } from "lucide-react";

interface FileExplorerProps {
    rootPath: string | null;
    onOpenFile: (path: string) => void;
}

function Node({
    entry,
    depth,
    onOpenFile,
}: {
    entry: FsEntry;
    depth: number;
    onOpenFile: (path: string) => void;
}) {
    const [expanded, setExpanded] = useState(false);

    const handleClick = () => {
        if (!entry.isDirectory) {
            onOpenFile(entry.path);
            return;
        }
        setExpanded((prev) => !prev);
    };

    return (
        <div>
            <div
                onClick={handleClick}
                style={{ paddingLeft: `${depth * 14 + 8}px` }}
                className="flex items-center gap-1.5 py-1 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer select-none"
            >
                {entry.isDirectory ? (
                    <>
                        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        {expanded ? (
                            <FolderOpen size={14} className="text-violet-400" />
                        ) : (
                            <Folder size={14} className="text-violet-400" />
                        )}
                    </>
                ) : (
                    <>
                        <span className="w-[14px]" />
                        <FileText size={14} className="text-zinc-500" />
                    </>
                )}
                <span className="truncate">{entry.name}</span>
            </div>

            {entry.isDirectory &&
                expanded &&
                entry.children?.map((child) => (
                    <Node key={child.path} entry={child} depth={depth + 1} onOpenFile={onOpenFile} />
                ))}
        </div>
    );
}

function FileExplorer({ rootPath, onOpenFile }: FileExplorerProps) {
    const [loadedFor, setLoadedFor] = useState<string | null>(null);
    const [rootEntries, setRootEntries] = useState<FsEntry[] | null>(null);

    if (rootPath && rootPath !== loadedFor) {
        listDirRecursive(rootPath).then((entries) => {
            setRootEntries(entries);
            setLoadedFor(rootPath);
        });
    }

    if (!rootPath) {
        return (
            <div className="h-full w-full bg-black flex items-center justify-center text-zinc-600 text-xs px-4 text-center">
                There is no opened folder
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-black overflow-y-auto py-2">
            {rootEntries?.map((entry) => (
                <Node key={entry.path} entry={entry} depth={0} onOpenFile={onOpenFile} />
            ))}
        </div>
    );
}

export default FileExplorer;