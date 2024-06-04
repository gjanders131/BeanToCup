'use client'

import { invoke } from '@tauri-apps/api/tauri'
import ButtonLarge from '@/components/ButtonLarge'
import { workspaceStore } from '@/components/Helpers/Store'
import CreateWorkSpace from '@/components/CreateWorkspace'
import SchemaSetup from '@/components/SchemaSetup'
import { useState } from 'react'

type TestProps = {
    key: string
    value: string[]
}

export default function Home() {
    const workspace = workspaceStore((state) => state)

    const [testMap, setTestMap] = useState<TestProps[]>()

    const handleOpenWorkspace = () => {
        invoke<string>('open_workspace')
            .then((dir: string) => {
                workspace.setPath(dir)
                workspace.setName(dir.split('/').pop() as string)
            })
            .catch((error) => console.error(error))
    }

    return (
        <main className='flex min-h-screen flex-col items-center justify-between p-24'>
            Hello
            <div>{workspace.path}</div>
            <div>{workspace.name}</div>
            <CreateWorkSpace />
            <ButtonLarge
                label='Open Workspace'
                onClick={() => handleOpenWorkspace()}
            />
            <SchemaSetup />
            <div>
                {testMap?.map((item) => (
                    <div key={item.key}>
                        <div>{item.key}</div>
                        <div>
                            {item.value.map((val) => (
                                <div key={val}>{val}</div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}
