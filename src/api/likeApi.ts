import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export async function getLikeStatus(postId: string | undefined) {
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
      return !querySnapshot.empty;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function toggleLikeFeed(
  status: string,
  postId: string | undefined
) {
  const authUser = auth.currentUser;
  console.log(status);
  try {
    if (authUser && postId) {
      const userId = authUser.uid;
      const likesCollection = collection(db, "likes");
      const q = query(
        likesCollection,
        where("userId", "==", userId),
        where("feedId", "==", postId)
      );
      const querySnapshot = await getDocs(q);
      if (status === "like") {
        if (querySnapshot.empty) {
          const likeSchema = {
            type: "feed",
            userId,
            feedId: postId,
            createdAt: new Date(),
          };
          await addDoc(likesCollection, likeSchema);
          const docRef = doc(db, "feeds", postId);
          await updateDoc(docRef, { likeCount: increment(1) });
        }
      } else {
        if (!querySnapshot.empty) {
          await deleteDoc(querySnapshot.docs[0].ref);
          const docRef = doc(db, "feeds", postId);
          await updateDoc(docRef, { likeCount: increment(-1) });
        }
      }
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function unLikeFeed(postId: string | undefined) {
  const authUser = auth.currentUser;
  try {
    if (authUser && postId) {
      const userId = authUser.uid;
      const likeCollection = collection(db, "likes");
      const q = query(
        likeCollection,
        where("userId", "==", userId),
        where("feedId", "==", postId)
      );
      const querySnapshot = await getDocs(q);
      await deleteDoc(querySnapshot.docs[0].ref);
      const docRef = doc(db, "feeds", postId);
      await updateDoc(docRef, { likeCount: increment(-1) });
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
