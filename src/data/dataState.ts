import { atom } from 'recoil';
import { LocationType, ReviewType, UserType } from '../lib/type';

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

export const ReviewState = atom<ReviewType[]>({
  key: 'ReviewState',
  default: [],
});
