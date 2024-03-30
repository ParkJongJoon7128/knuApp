import { atom } from 'recoil';
import { LocationType, UserType } from '../lib/type';

export const userState = atom<UserType[]>({
  key: 'userState',
  default: [],
});

export const locationState = atom<LocationType[]>({
  key: 'locationState',
  default: [],
});

export const BottomSheetDataState = atom({
  key: 'BottomSheetDataState',
  default: [],
});
