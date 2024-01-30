export interface UpdateData {
  userId: string | undefined;
  key: string;
  value: string | undefined;
}

export interface ImageUpload {
  profileImgFile: File | null;
  coverImgFile: File | null;
}

export interface UserType {
  userId: string;
  email: string;
  name: string;
  nickName: string;
  bio: string;
  profileImage: string;
  coverImage: string;
  createdAt: Date;
  updatedAt: Date;
}
