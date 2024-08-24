import { create } from 'zustand'

interface ArticleState {
    data: IArticle,
    update: (data: IArticle) => void,
}

const useArticleStore = create<ArticleState>()((set) => ({
    data: {
        id: 0,
        title: '' ,
        content: '',
    
        writerId : '',
        boardId : '',
        modDate : '',
        regDate : '',
        answer:'',
    },
    update: (data: IArticle) => set({ data }),
}))

export const useArticleAction = () => useArticleStore((store) => store.update)
export const useArticleStack = () => useArticleStore((store) => store.data)
export const useArticleState = () => useArticleStore.getState();
