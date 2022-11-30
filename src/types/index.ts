export interface GuestbookPost {
  postId: number;
  content: string;
  userId: number;
  userName: string;
  createdAt: Date;
}
export interface googleSignInResponse {
  clientId: string;
  credential: string;
  select_by: string;
}

export interface User {
  userId: number;
  userName: string;
  userEmail: string;
  userPicture?: string;
}
