'use client'
import { create } from 'zustand'

export type AuthTab = 'sign-in' | 'sign-up'

interface UIState {
    isAuthModalOpen: boolean
    activeAuthTab: AuthTab
}

interface UIActions {
    toggleAuthModal: () => void
    openAuthModal: (tab?: AuthTab) => void
    setActiveAuthTab: (tab: AuthTab) => void
}

type UIStore = UIState & UIActions

export const useUIStore = create<UIStore>((set) => ({
    isAuthModalOpen: false,
    activeAuthTab: 'sign-in',
    openAuthModal: (tab?: AuthTab) => set({
        isAuthModalOpen: true,
        ...(tab && { activeAuthTab: tab })
    }),
    toggleAuthModal: () => set((state) => ({ isAuthModalOpen: !state.isAuthModalOpen })),
    setActiveAuthTab: (tab: AuthTab) => set({ activeAuthTab: tab }),
}))