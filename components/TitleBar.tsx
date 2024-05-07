'use client'

import { WebviewWindow } from '@tauri-apps/api/window'
import { useEffect, useState } from 'react'

const TitleBar = () => {
    const [appWindow, setAppWindow] = useState<WebviewWindow>()

    // Import appWindow and save it inside the state for later usage
    async function setupAppWindow() {
        const appWindow = (await import('@tauri-apps/api/window')).appWindow
        setAppWindow(appWindow)
    }

    useEffect(() => {
        setupAppWindow()
    }, [])

    return (
        <div
            data-tauri-drag-region
            className='h-6 select-none flex justify-start top-0 fixed left-0 right-0 bg-zinc-600 z-50'
        ></div>
    )
}
export default TitleBar
