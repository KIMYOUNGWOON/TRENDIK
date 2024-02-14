export interface User {
  email: string;
  password: string;
  name?: string;
  nickName?: string;
  gender?: string;
  height?: number;
  weight?: number;
  shoesSize?: number;
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
  content: string;
  gender: string;
  style: string;
  imageFiles: (File | string)[];
  preImagesCount: number;
}
