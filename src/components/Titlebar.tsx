import { useState, useEffect } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { Minus, Maximize, Minimize, X } from 'lucide-react';

const appWindow = getCurrentWindow();

function Titlebar() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    let isMounted = true;

    const setupListener = async () => {
      const unsubscribe = await appWindow.onResized(async () => {
        const maximized = await appWindow.isMaximized();
        if (isMounted) {
          setIsMaximized(maximized);
        }
      });
      
      if (!isMounted) {
        unsubscribe();
      } else {
        unlisten = unsubscribe;
      }
    };

    const checkInitialState = async () => {
      const maximized = await appWindow.isMaximized();

      if (isMounted) {
        setIsMaximized(maximized);
      }
    };

    setupListener();
    checkInitialState();

    return () => {
      isMounted = false;

      if (unlisten) {
        unlisten();
      }
    };
  }, []);

  const handleCloseWindow = async () => {
    await appWindow.close();
  }

  const handleMaximizeWindow = async () => {
    await appWindow.toggleMaximize();
  }

  const handleMinimizeWindow = async () => {
    await appWindow.minimize();
  }

  return (
    <div 
      data-tauri-drag-region 
      className="h-9 w-full bg-black backdrop-blur-md border-b border-white/10 flex items-center justify-between select-none pl-4 pr-2"
    >
      <div className="flex items-center gap-2 pointer-events-none">
        <span className="text-sm font-semibold tracking-wide text-neutral-300">
          Meovv
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={handleMinimizeWindow}
          className="h-8 w-10 flex items-center justify-center text-neutral-400 hover:text-yellow-500 hover:bg-yellow-500/20 transition-colors rounded-md"
        >
          <Minus size={14} strokeWidth={2.5} />
        </button>
        
        <button
          onClick={handleMaximizeWindow}
          className="h-8 w-10 flex items-center justify-center text-neutral-400 hover:text-green-500 hover:bg-green-500/20 transition-colors rounded-md"
        >
          {isMaximized ? (
            <Minimize size={14} strokeWidth={2.5} />
          ) : (
            <Maximize size={14} strokeWidth={2.5} />
          )}
        </button>
        
        <button
          onClick={handleCloseWindow}
          className="h-8 w-10 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-500/20 transition-all rounded-md"
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

export default Titlebar;