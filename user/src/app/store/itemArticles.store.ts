import { create } from 'zustand'

interface ItemArticlestate {
    data: IItemArticle,
    action: {
        update: (data: IItemArticle) => void,
        clean: () => void,
    }
}

const useItemArticlestore = create<ItemArticlestate>()((set, get) => ({
    data: {
        id: 0,
        title: '',
        content: '',
        writerId: '',
        stockBoards: '',
    },
    action: {
        update: (data: IItemArticle) => set({ data }),
        clean: () => set({
            data: {
                id: 0,
                title: '',
                content: '',
                writerId: '',
                stockBoards: '',
            }
        }),
    }
}))

export const useItemArticleAction = () => useItemArticlestore((store) => store.action)
export const useItemArticlestack = () => useItemArticlestore((store) => store.data)
export const useItemArticlestate = () => useItemArticlestore.getState();
