import { create } from 'zustand'

interface YourChatState {
    data: IChat,
    action: {
        update: (data: IChat) => void,
        YourChatMessage: (data: string) => void,
        setUsername: (senderName: string) => void,
        clean: () => void,
    }
}

const useYourChatStore = create<YourChatState>()((set) => ({
    data: { id: '', roomId: '' },
    action: {
        update: (data: IChat) => set({ data }),
        YourChatMessage: (message: string) => set((state) => ({ data: { ...state.data, message, }, })),
        setUsername: (senderName: string) => set((state) => ({ data: { ...state.data, senderName, }, })),
        clean: () => set({
            data: {
                id: '',
                roomId: '',
                senderName: '',
                message: '',
                createdAt: '',
                title : '',
                members : ['',''],
            }
        })
    }
}))

export const useYourYourChatAction = () => useYourChatStore((store) => store.action)
export const useYourChatStack = () => useYourChatStore((store) => store.data)
export const useYourChatState = () => useYourChatStore.getState();
