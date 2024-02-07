import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export async function getLikeStatus(postId: string | undefined) {
  const authuser = auth.currentUser;
  try {
    if (authuser) {
      const userId = authuser.uid;
      const likeCollection = collection(db, "likes");
      const q = query(
        likeCollection,
        where("userId", "==", userId),
        where("feedId", "==", postId)
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function likeFeed(postId: string | undefined) {
  const authUser = auth.currentUser;
  try {
    if (authUser) {
      const userId = authUser.uid;
      const likeSchema = {
        type: "feed",
        userId,
        feedId: postId,
        createdAt: new Date(),
      };
      const likesCollection = collection(db, "likes");
      await addDoc(likesCollection, likeSchema);
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function unLikeFeed(postId: string | undefined) {
  const authUser = auth.currentUser;
  try {
    if (authUser) {
      const userId = authUser.uid;
      const likeCollection = collection(db, "likes");
      const q = query(
        likeCollection,
        where("userId", "==", userId),
        where("feedId", "==", postId)
      );
      const querySnapshot = await getDocs(q);
      await deleteDoc(querySnapshot.docs[0].ref);
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
