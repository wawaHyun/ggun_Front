import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware';

interface GlobalStockState {
    data: IGlobalStock,
    update: (data: any) => void,
    clean: () => void,
}

const useGlobalStockStore = create(persist<GlobalStockState>((set, get) => ({
    data: { id:0, code: '', name: '' },
    update: (data: IGlobalStock) => set({ data }),
    clean: () => set({ data:{ id:0, code: '', name: '' } })
}),
    {
        name: 'globalStock-storage',
        storage: createJSONStorage(() => sessionStorage),
    }
));

export const useGlobalStock = () => useGlobalStockStore((store) => store)
export const useGlobalStockState = () => useGlobalStockStore.getState();
