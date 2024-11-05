import { create } from 'zustand';

import type { IsOpenSliceInterface } from './slices/createIsOpenSlice';
import { createIsOpenSlice } from './slices/createIsOpenSlice';

type AppStoreInterface = IsOpenSliceInterface;

export const useAppStore = create<AppStoreInterface>()((...a) => ({
  ...createIsOpenSlice(...a),
}));
