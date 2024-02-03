export interface UpdateData {
  userId: string | undefined;
  key: string;
  value: string | undefined;
}

export interface ImageUpload {
  profileImgFile: File | null;
  coverImgFile: File | null;
}
