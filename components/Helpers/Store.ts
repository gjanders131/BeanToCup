import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type WorkspaceProps = {
    name: string
    path: string

    setName: (name: string) => void
    setPath: (path: string) => void
}

export const workspaceStore = create<WorkspaceProps>()((set) => ({
    name: '',
    path: '',

    setName: (name: string) => set({ name }),
    setPath: (path: string) => set({ path }),
}))

type SchemaProps = {
    dirCategories: string[]
    assetCategories: string[]
    dirSubCategories: string[][]

    setDirCategories: (dir_categories: string[]) => void
    setDirCategory: (dir_category: string, index: number) => void

    setDirSubCategories: (dir_sub_categories: string[][]) => void
    setDirSubCategory: (index: number, dir_sub_categories: string[]) => void
    removeDirSubCategory: (index: number) => void

    setAssetCategories: (asset_categories: string[]) => void
    setAssetCategory: (dir_category: string, index: number) => void
}

export const schemaStore = create<SchemaProps>()(
    immer((set) => ({
        dirCategories: [],
        dirSubCategories: [[]],
        assetCategories: [],

        // Directory Categories
        setDirCategories: (dir_categories: string[]) =>
            set((state) => {
                state.dirCategories = dir_categories
            }),
        setDirCategory: (dir_category: string, index: number) =>
            set((state) => {
                state.dirCategories[index] = dir_category
            }),

        // Directory Sub Categories
        setDirSubCategories: (dir_sub_categories: string[][]) =>
            set((state) => {
                state.dirSubCategories = dir_sub_categories
            }),
        setDirSubCategory: (index: number, dir_sub_categories: string[]) =>
            set((state) => {
                state.dirSubCategories[index] = dir_sub_categories
            }),
        removeDirSubCategory: (index: number) =>
            set((state) => {
                state.dirSubCategories.splice(index, 1)
            }),

        // Asset Categories
        setAssetCategories: (asset_categories: string[]) =>
            set((state) => {
                state.assetCategories = asset_categories
            }),
        setAssetCategory: (asset_category: string, index: number) =>
            set((state) => {
                state.assetCategories[index] = asset_category
            }),
    }))
)
