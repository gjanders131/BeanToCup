import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { invoke } from '@tauri-apps/api'

type InputListProps = {
    array: string[]
    setArray: (array: string[]) => void
    removeSubDirCategory?: (index: number) => void
    children?: React.ReactNode
}

const InputList = ({
    array,
    setArray,
    removeSubDirCategory,
    children,
}: InputListProps) => {
    const [CategoryKeys, setCategoryKeys] = useState<string[]>([])
    const [inputError, setInputError] = useState<string>('')

    const handleAddCategory = () => {
        setArray([...array, ''])
        setCategoryKeys([...CategoryKeys, uuidv4()])
    }

    const handleCategoryChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        invoke('validate_text', { text: e.target.value })
            .then(() => setInputError(''))
            .catch((error) => setInputError(error))
        setArray(
            array.map((category, i) => {
                if (i === index) {
                    return e.target.value
                }
                return category
            })
        )
    }

    const handleCategoryRemoval = (index: number) => () => {
        setArray(array.filter((_, i) => i !== index))
        setCategoryKeys(CategoryKeys.filter((_, i) => i !== index))
        removeSubDirCategory?.(index)
    }

    return (
        <div className='flex flex-col'>
            <button onClick={handleAddCategory}>Add a Category</button>
            <ol className='flex flex-col'>
                {array ? (
                    array.map((category, index) => (
                        <li key={CategoryKeys[index]}>
                            <input
                                className='text-black mt-1 p-1'
                                type='text'
                                defaultValue={category}
                                onChange={(e) => {
                                    handleCategoryChange(e, index)
                                }}
                                onReset={(e) => {
                                    console.log(e)
                                }}
                                value={category}
                            />
                            <button onClick={handleCategoryRemoval(index)}>
                                X
                            </button>
                        </li>
                    ))
                ) : (
                    <></>
                )}
            </ol>
            <div>{inputError}</div>
        </div>
    )
}

export default InputList
