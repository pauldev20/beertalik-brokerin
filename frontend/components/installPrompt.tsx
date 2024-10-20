"use client";

import { ArrowUpOnSquareIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function InstallPrompt({ children }: Readonly<{ children: React.ReactNode }>) {
    const [isStandalone, setIsStandalone] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        setIsIOS(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
        )
        setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
    }, []);
    useEffect(() => {
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        // setIsMobile(mobileRegex.test(navigator.userAgent) || window.innerWidth < 768);
        setIsMobile(true);
    }, []);

    if (isStandalone) {
        return children;
    }

    return (
        <div className="h-screen w-screen flex flex-col gap-4 items-center justify-center p-3">
            <h3 className="text-2xl font-bold">🍺 Install App 🍺</h3>

            {!isMobile && (<p className="text-center">
                This site is intended for mobile devices only. Please visit us on a mobile device for the best experience.
            </p>)}

            {(!isIOS && isMobile) && (
                <Button>Add to Home Screen</Button>
            )}

            {(isIOS && isMobile) && (
                <p className="flex flex-col items-center justify-center text-center gap-2">
                    <span>
                        To install this app on your iOS device, tap the share button
                        <span className="inline-flex items-center align-middle">
                            <ArrowUpOnSquareIcon className="size-5 mx-1" />
                        </span>
                        and then "Add to Home Screen"
                        <span className="inline-flex items-center align-middle">
                            <PlusIcon className="size-5 mx-1" />
                        </span>
                    </span>
                </p>
            )}
        </div>
    )
}
