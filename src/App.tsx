import "./App.css";
import { useState, useCallback } from "react";
import Editor from "./components/Editor";
import Titlebar from "./components/Titlebar";
import FileExplorer from "./components/FileExplorer";
import Tabs from "./components/Tabs";
import { pickFolder, readFile, writeFile, languageFromPath } from "./lib/fs";
import type { FileTab } from "./types";

function App() {
    const [rootPath, setRootPath] = useState<string | null>(null);
    const [tabs, setTabs] = useState<FileTab[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);

    const activeTab = tabs.find((t) => t.id === activeId) ?? null;

    const openFile = useCallback(async (path: string) => {
        const existing = tabs.find((t) => t.path === path);
        if (existing) {
            setActiveId(existing.id);
            return;
        }
        const content = await readFile(path);
        const id = crypto.randomUUID();
        const newTab: FileTab = {
            id,
            path,
            name: path.split(/[/\\]/).pop() ?? path,
            content,
            originalContent: content,
            language: languageFromPath(path),
            isDirty: false,
        };
        setTabs((prev) => [...prev, newTab]);
        setActiveId(id);
    }, [tabs]);

    const changeCode = (newCode: string) => {
        if (!activeId) return;
        setTabs((prev) =>
            prev.map((t) =>
                t.id === activeId
                    ? { ...t, content: newCode, isDirty: newCode !== t.originalContent }
                    : t
            )
        );
    };

    const saveActive = async () => {
        if (!activeTab) return;
        await writeFile(activeTab.path, activeTab.content);
        setTabs((prev) =>
            prev.map((t) =>
                t.id === activeTab.id ? { ...t, originalContent: t.content, isDirty: false } : t
            )
        );
    };

    const closeTab = (id?: string) => {
        const targetId = id ?? activeId;
        if (!targetId) return;
        setTabs((prev) => {
            const filtered = prev.filter((t) => t.id !== targetId);
            if (targetId === activeId) {
                setActiveId(filtered.length ? filtered[filtered.length - 1].id : null);
            }
            return filtered;
        });
    };

    const openFolder = async () => {
        const folder = await pickFolder();
        if (folder) setRootPath(folder);
    };

    return (
        <main className="h-screen w-screen flex flex-col bg-black text-neutral-200 overflow-hidden">
            <Titlebar />
            
            <div className="flex flex-1 min-h-0">
                <div className="w-56 border-r border-zinc-800 flex flex-col">
                  <button
                    onClick={openFolder}
                    className="text-xs text-zinc-400 hover:text-zinc-200 px-3 py-2 text-left border-b border-zinc-800"
                  >
                    Open Folder
                  </button>
                  <FileExplorer rootPath={rootPath} onOpenFile={openFile} />
                </div>

                <div className="flex-1 min-w-0 flex flex-col">
                    <Tabs tabs={tabs} activeId={activeId} onSelect={setActiveId} onClose={closeTab} />
                    {activeTab ? (
                        <Editor
                          key={activeTab.id}
                          code={activeTab.content}
                          language={activeTab.language}
                          onChangeCode={changeCode}
                          onSave={saveActive}
                          onCloseTab={() => closeTab(activeTab.id)}
                          onOpenFile={openFile}
                          onQuitAll={() => setTabs([])}
                        />
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">
                        Open file
                      </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default App;