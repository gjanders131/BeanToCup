'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import PopUp from './PopUp'
import { invoke } from '@tauri-apps/api'
import { schemaStore, workspaceStore } from './Helpers/Store'
import InputList from './InputList'
import { dir } from 'console'

const SchemaSetup = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const useWorkspaceStore = workspaceStore((state) => state)

    // State variables for Directory and Asset Categories
    const useSchemaStore = schemaStore((state) => state)

    const dirCategories = useSchemaStore.dirCategories
    const assetCategories = useSchemaStore.assetCategories
    const dirSubCategories = useSchemaStore.dirSubCategories

    const setDirCategories = useSchemaStore.setDirCategories
    const setAssetCategories = useSchemaStore.setAssetCategories
    const setDirSubCategory = useSchemaStore.setDirSubCategory
    const setDirSubCategories = useSchemaStore.setDirSubCategories
    const removeDirSubCategory = useSchemaStore.removeDirSubCategory

    const handleApplyChanges = () => {
        let dirSubs: [{ [dir: string]: string[] }] = [{}]
        dirCategories.map((dir, index) => {
            dirSubs[index] = { [dir]: dirSubCategories[index] }
        })

        let categories = JSON.stringify({
            directory: dirSubs,
            asset: assetCategories,
        })
        invoke('write_categories_into_workspace', {
            workspace: useWorkspaceStore.path,
            content: categories,
        })
            .then((res) => {
                console.log(res)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    // Open popup and get workspace info
    const handleOpenPopUp = () => {
        setIsOpen(true)

        invoke<string>('get_workspace', {
            workspacePath: useWorkspaceStore.path,
        })
            .then((res) => {
                let dirKeys: string[] = []
                let dirSubs: [string[]] = [[]]

                let dirCats = JSON.parse(res).categories.directory
                dirCats.map(
                    (dir: { [dir: string]: string[] }, index: number) => {
                        for (let key in dir) {
                            dirKeys.push(key)
                        }
                        dirSubs[index] = dir[Object.keys(dir)[0]]
                    }
                )
                setDirCategories(dirKeys)
                setDirSubCategories(dirSubs)
                setAssetCategories(JSON.parse(res).categories.asset)
            })
            .catch((error) => {
                setDirCategories([''])
                setAssetCategories([''])
                console.error(error)
            })
    }

    const refreshSubDirs = useMemo(() => {
        return (
            <ul>
                {dirSubCategories.map((_, index) => (
                    <li key={index}>
                        <InputList
                            array={dirSubCategories[index]}
                            setArray={(subDirs) =>
                                setDirSubCategory(index, subDirs)
                            }
                        />
                    </li>
                ))}
            </ul>
        )
    }, [dirSubCategories, setDirSubCategory])

    useEffect(() => {
        if (dirCategories.length > dirSubCategories.length) {
            setDirSubCategory(dirCategories.length - 1, [])
        }
    }, [dirCategories, dirSubCategories, setDirSubCategory])

    // TODO: Format lists better
    return (
        <>
            <button onClick={handleOpenPopUp}>Setup Schema</button>
            <PopUp
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            >
                <div>
                    <div>Setup your folder structure</div>
                    <div className='flex flex-row justify-between'>
                        <InputList
                            array={dirCategories}
                            setArray={setDirCategories}
                            removeSubDirCategory={removeDirSubCategory}
                        ></InputList>
                        {refreshSubDirs}
                    </div>
                    <div>Setup your Asset folder structure</div>
                    <InputList
                        array={assetCategories}
                        setArray={setAssetCategories}
                    />
                    <div>Folder Structure Preview</div>
                    <div>{dirCategories.join('/')}</div>
                    <button onClick={handleApplyChanges}>Apply Changes</button>
                </div>
            </PopUp>
        </>
    )
}

export default SchemaSetup
