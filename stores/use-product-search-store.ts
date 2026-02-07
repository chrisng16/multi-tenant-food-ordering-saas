'use client'

import { create } from 'zustand'

interface ProductSearchState {
    isSearchModalOpen: boolean
    searchQuery: string
}

interface ProductSearchActions {
    openSearchModal: () => void
    closeSearchModal: () => void
    setSearchQuery: (query: string) => void
    clearSearch: () => void
}

type ProductSearchStore = ProductSearchState & ProductSearchActions

export const useProductSearchStore = create<ProductSearchStore>((set) => ({
    isSearchModalOpen: false,
    searchQuery: '',

    openSearchModal: () => set({ isSearchModalOpen: true }),

    closeSearchModal: () => set({ isSearchModalOpen: false, searchQuery: '' }),

    setSearchQuery: (query: string) => set({ searchQuery: query }),

    clearSearch: () => set({ searchQuery: '' }),
}))
