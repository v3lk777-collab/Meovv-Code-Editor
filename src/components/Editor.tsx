"use client";
import { useEffect, useRef } from "react";
import { initVimMode, VimMode } from "monaco-vim";
import { Editor as MonacoEditor, type OnMount } from "@monaco-editor/react";

interface EditorProps {
    code: string;
    language: string;
    onChangeCode: (code: string) => void;
    onSave: () => void;
    onCloseTab: () => void;
    onOpenFile: (path: string) => void;
    onQuitAll: () => void;
}

let exCommandsRegistered = false;

function Editor({
    code,
    language,
    onChangeCode,
    onSave,
    onCloseTab,
    onOpenFile,
    onQuitAll,
}: EditorProps) {
    const statusBarRef = useRef<HTMLDivElement>(null);
    const vimModeRef = useRef<{ dispose: () => void } | null>(null);
    const handlersRef = useRef({ onSave, onCloseTab, onOpenFile, onQuitAll });
    handlersRef.current = { onSave, onCloseTab, onOpenFile, onQuitAll };

    useEffect(() => {
        return () => vimModeRef.current?.dispose();
    }, []);

    const handleMount: OnMount = (editor, monaco) => {
        monaco.editor.defineTheme("mello-black", {
            base: "vs-dark",
            inherit: true,
            rules: [],
            colors: {
                "editor.background": "#000000",
                "editor.lineHighlightBackground": "#0a0a0a",
                "editorGutter.background": "#000000",
                "editorLineNumber.foreground": "#3a3a3a",
                "editorLineNumber.activeForeground": "#888888",
                "editorCursor.foreground": "#00ff00",
                "editor.selectionBackground": "#2a2a2a",
            },
        });
        monaco.editor.setTheme("mello-black");

        if (!exCommandsRegistered) {
            exCommandsRegistered = true;
            const Vim = VimMode.Vim;

            Vim.defineEx("write", "w", () => handlersRef.current.onSave());
            Vim.defineEx("quit", "q", () => handlersRef.current.onCloseTab());
            Vim.defineEx("wq", "wq", () => {
                handlersRef.current.onSave();
                handlersRef.current.onCloseTab();
            });
            Vim.defineEx("qall", "qa", () => handlersRef.current.onQuitAll());
            Vim.defineEx("edit", "e", (_cm: unknown, params: { args?: string[] }) => {
                const path = params.args?.[0];
                if (path) handlersRef.current.onOpenFile(path);
            });
        }

        if (statusBarRef.current) {
            vimModeRef.current = initVimMode(editor, statusBarRef.current);
        }
    };

    return (
        <div className="h-full w-full bg-black overflow-hidden flex flex-col">
            <div className="flex-1 min-h-0">
                <MonacoEditor
                    theme="mello-black"
                    height="100%"
                    language={language}
                    value={code}
                    onChange={(value) => onChangeCode(value || "")}
                    onMount={handleMount}
                    options={{
                        fontSize: 14,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        minimap: { enabled: false },
                        cursorBlinking: "blink",
                        cursorStyle: "block",
                        smoothScrolling: true,
                        scrollBeyondLastLine: false,
                        renderLineHighlight: "all",
                        automaticLayout: true,
                        padding: { top: 12 },
                    }}
                />
            </div>
            <div
                ref={statusBarRef}
                className="h-6 bg-black text-green-500 text-xs px-2 flex items-center border-t border-zinc-800 font-mono"
            />
        </div>
    );
}

export default Editor;