'use client'

import { useRef, useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import ButtonLarge from '@/components/ButtonLarge'

export default function Home() {
    const [folder, setFolder] = useState<string>('')
    const folderTextRef = useRef(null)

    const handleCreateWorkspace = () => {
        invoke<string>('create_workspace')
            .then((dir: string) => setFolder(dir))
            .catch((error) => console.error(error))
    }

    const handleOpenWorkspace = () => {
        invoke<string>('open_workspace')
            .then((dir: string) => setFolder(dir))
            .catch((error) => console.error(error))
    }

    return (
        <main className='flex min-h-screen flex-col items-center justify-between p-24'>
            Hello
            <div ref={folderTextRef}>{folder}</div>
            <ButtonLarge
                label='Create Workspace'
                onClick={() => handleCreateWorkspace()}
            />
            <ButtonLarge
                label='Open Workspace'
                onClick={() => handleOpenWorkspace()}
            />
        </main>
    )
}
