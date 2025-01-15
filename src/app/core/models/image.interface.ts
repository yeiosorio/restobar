export interface ImageData {
  id: string;
  fileName: string;
  url: string;
  uploadDate: string;
  userName: string;
  originalName: string;
}

export interface ImageResponse {
  message: string;
  data: ImageData;
} 