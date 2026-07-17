import { X } from "lucide-react";
import type { FileTab } from "../types";

interface TabsProps {
    tabs: FileTab[];
    activeId: string | null;
    onSelect: (id: string) => void;
    onClose: (id: string) => void;
}

function Tabs({ tabs, activeId, onSelect, onClose }: TabsProps) {
    if (tabs.length === 0) return null;

    return (
        <div className="h-9 w-full bg-black border-b border-zinc-800 flex items-stretch overflow-x-auto">
            {tabs.map((tab) => {
                const active = tab.id === activeId;
                return (
                    <div
                        key={tab.id}
                        onClick={() => onSelect(tab.id)}
                        className={`group flex items-center gap-2 px-3 border-r border-zinc-800 cursor-pointer text-xs whitespace-nowrap ${
                            active
                                ? "bg-zinc-900 text-zinc-100"
                                : "bg-black text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300"
                        }`}
                    >
                        <span className={active ? "border-t-2 border-violet-500 -mt-[9px] pt-[9px]" : ""}>
                            {tab.name}
                        </span>
                        {tab.isDirty && <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose(tab.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 hover:text-red-400"
                        >
                            <X size={12} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

export default Tabs;