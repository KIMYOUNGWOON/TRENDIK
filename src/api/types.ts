export interface User {
  email: string;
  password: string;
  name?: string;
  nickName?: string;
  gender?: string;
  height?: string;
  weight?: string;
  shoesSize?: string;
}

export interface ImageUpload {
  profileImgFile: File | null;
  coverImgFile: File | null;
}

export interface PostData {
  content: string;
  gender: string;
  style: string;
  feedImages: File[];
  outer: string;
  top: string;
  bottom: string;
  shoes: string;
}

export interface FeedUpdateData {
  hashTag: { id: number; hashTag: string }[];
  outer: string;
  top: string;
  bottom: string;
  shoes: string;
  content: string;
  gender: string;
  style: string;
  imageFiles: (File | string)[];
  preImagesCount: number;
}

export interface Message {
  sender: string;
  receiver: string;
  message: string;
  readBy: string[];
  createdAt: Date;
}
