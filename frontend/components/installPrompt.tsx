"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt({ children }: Readonly<{ children: React.ReactNode }>) {
    const [isIOS, setIsIOS] = useState(false)
    const [isStandalone, setIsStandalone] = useState(false)
   
    useEffect(() => {
        setIsIOS(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
        )
        setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
    }, [])
   
    return children;
    if (isStandalone) {
        return children;
    }
   
    return (
        <div>
          <h3>Install App</h3>
          <button>Add to Home Screen</button>
          {isIOS && (
            <p>
              To install this app on your iOS device, tap the share button
              <span role="img" aria-label="share icon">
                {' '}
                ⎋{' '}
              </span>
              {"and then \"Add to Home Screen\""}
              <span role="img" aria-label="plus icon">
                {' '}
                ➕{' '}
              </span>.
            </p>
          )}
        </div>
    )
}
