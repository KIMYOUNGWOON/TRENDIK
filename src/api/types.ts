export interface User {
  email: string;
  password: string;
  name?: string;
  nickName?: string;
}

export interface UpdateData {
  userId: string | undefined;
  key: string;
  value: string | undefined;
}

export interface ImageUpload {
  profileImgFile: File | null;
  coverImgFile: File | null;
}

export interface PostData {
  content: string;
  gender: string;
  style: string;
  imageFiles: File[];
}

export interface FeedUpdateData {
  content: string;
  gender: string;
  style: string;
  imageFiles: (File | string)[];
  preImagesCount: number;
}
