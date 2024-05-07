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
    dir_categories: string[]
    asset_categories: string[]

    setDirCategories: (dir_category: string[]) => void
    setDirCategory: (dir_category: string, index: number) => void

    setAssetCategories: (asset_category: string[]) => void
    setAssetCategory: (dir_category: string, index: number) => void
}

export const schemaStore = create<SchemaProps>()(
    immer((set) => ({
        dir_categories: [],
        asset_categories: [],

        setDirCategories: (dir_category: string[]) =>
            set((state) => {
                state.dir_categories = dir_category
            }),
        setDirCategory: (dir_category: string, index: number) =>
            set((state) => {
                state.dir_categories[index] = dir_category
            }),

        setAssetCategories: (asset_category: string[]) =>
            set((state) => {
                state.asset_categories = asset_category
            }),
        setAssetCategory: (asset_category: string, index: number) =>
            set((state) => {
                state.asset_categories[index] = asset_category
            }),
    }))
)
