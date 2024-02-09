import Resizer from "react-image-file-resizer";

export const resizeImage = (file: File) =>
  new Promise<File>((resolve) => {
    Resizer.imageFileResizer(
      file, // 원본 이미지 파일
      800, // 최대 너비
      800, // 최대 높이
      "JPEG", // 변환될 이미지 형식
      70, // 품질
      0, // 회전
      (blob) => {
        const resizedImage = new File([blob as Blob], file.name, {
          type: "image/jpeg",
        });
        resolve(resizedImage);
      },
      "blob" // Blob 형태로 출력
    );
  });

export const resizeProfileImage = (file: File) =>
  new Promise<File>((resolve) => {
    Resizer.imageFileResizer(
      file, // 원본 이미지 파일
      300, // 최대 너비
      300, // 최대 높이
      "JPEG", // 변환될 이미지 형식
      60, // 품질
      0, // 회전
      (blob) => {
        const resizedImage = new File([blob as Blob], file.name, {
          type: "image/jpeg",
        });
        resolve(resizedImage);
      },
      "blob" // Blob 형태로 출력
    );
  });
