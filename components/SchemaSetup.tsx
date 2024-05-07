import { useState } from 'react'
import PopUp from './PopUp'
import { invoke } from '@tauri-apps/api'
import { schemaStore } from './Helpers/Store'
import { v4 as uuidv4 } from 'uuid'

const SchemaSetup = () => {
    const useSchemaStore = schemaStore((state) => state)

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [dirCategoryKeys, setDirCategoryKeys] = useState<string[]>(
        useSchemaStore.dir_categories.map(() => uuidv4())
    )
    const [inputError, setInputError] = useState<string>('')

    const handleAddCategory = () => {
        useSchemaStore.setDirCategories([...useSchemaStore.dir_categories, ''])
        setDirCategoryKeys([...dirCategoryKeys, uuidv4()])
    }

    const handleCategoryChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        invoke('validate_text', { text: e.target.value })
            .then(() => setInputError(''))
            .catch((error) => setInputError(error))
        useSchemaStore.setDirCategories(
            useSchemaStore.dir_categories.map((category, i) => {
                if (i === index) {
                    return e.target.value
                }
                return category
            })
        )
    }

    const handleDirCategoryRemoval = (index: number) => () => {
        useSchemaStore.setDirCategories(
            useSchemaStore.dir_categories.filter((_, i) => i !== index)
        )
        setDirCategoryKeys(dirCategoryKeys.filter((_, i) => i !== index))
    }

    const handleApplyChanges = () => {
        let jsonCats = JSON.stringify(useSchemaStore.dir_categories)
        console.log(jsonCats)
    }

    return (
        <>
            <PopUp
                isOpen={true}
                setIsOpen={setIsOpen}
            >
                <div>
                    <div>Setup your folder structure</div>
                    <button onClick={handleAddCategory}>Add a Category</button>
                    <ol className='flex flex-col'>
                        {useSchemaStore.dir_categories.map(
                            (category, index) => (
                                <li key={dirCategoryKeys[index]}>
                                    <input
                                        className='text-black mt-1 p-1'
                                        type='text'
                                        defaultValue={category}
                                        onChange={(e) => {
                                            handleCategoryChange(e, index)
                                        }}
                                    />
                                    <button
                                        onClick={handleDirCategoryRemoval(
                                            index
                                        )}
                                    >
                                        X
                                    </button>
                                </li>
                            )
                        )}
                    </ol>
                    <div>{inputError}</div>
                    <div>Folder Structure Preview</div>
                    <div>{useSchemaStore.dir_categories.join('/')}</div>
                    <button onClick={handleApplyChanges}>Apply Changes</button>
                </div>
            </PopUp>
        </>
    )
}

export default SchemaSetup
