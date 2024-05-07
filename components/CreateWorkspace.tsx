'use client'

import { invoke } from '@tauri-apps/api'
import ButtonLarge from './ButtonLarge'
import { workspaceStore } from './Helpers/Store'
import { ChangeEvent, useEffect, useState } from 'react'
import PopUp from './PopUp'

const CreateWorkSpace = () => {
    const workspace = workspaceStore((state) => state)

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [folder, setFolder] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [inputError, setInputError] = useState<string>('')

    const handleButtonClick = () => {
        setIsOpen(true)
    }

    const handleSelectFolder = () => {
        let base = '/'
        if (workspace.path !== '') {
            base = workspace.path
        }

        invoke<string>('open_dir', {
            basePath: base,
        })
            .then((dir: string) => {
                setFolder(dir)
            })
            .catch((error) => console.error(error))
    }

    const handleInputText = (e: ChangeEvent<HTMLInputElement>) => {
        invoke('validate_text', { text: e.target.value })
            .then(() => setInputError(''))
            .catch((error) => setInputError(error))
        setName(e.target.value)
    }

    const handleWorkspaceCreation = () => {
        invoke<string>('create_workspace', { path: folder, name: name })
            .then((res: string) => {
                workspace.setPath(folder)
                workspace.setName(name)
                setIsOpen(false)
            })
            .catch((error) => invoke('message_box', { message: error }))
    }

    useEffect(() => {
        if (!isOpen) {
            setFolder('')
            setName('')
        }
    }, [isOpen])

    return (
        <>
            <ButtonLarge
                label='Create Workspace'
                onClick={() => handleButtonClick()}
            />
            <PopUp
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            >
                <div className='flex flex-col'>
                    <div>Select a directory</div>
                    <div className='flex flex-row justify-evenly'>
                        <div className='flex-grow bg-slate-200 text-black'>
                            {folder}
                        </div>
                        <button onClick={handleSelectFolder}>
                            Select Project Folder
                        </button>
                    </div>
                    <div>Workspace Name</div>
                    <input
                        className={
                            'bg-slate-200 text-black p-2' +
                            (inputError
                                ? ' outline-red-500 outline-2 outline'
                                : '')
                        }
                        type='text'
                        value={name}
                        onChange={handleInputText}
                    />
                    <div>{inputError}</div>
                    <button
                        onClick={handleWorkspaceCreation}
                        disabled={inputError !== '' || folder === ''}
                    >
                        Create Workspace
                    </button>
                </div>
            </PopUp>
        </>
    )
}

export default CreateWorkSpace
