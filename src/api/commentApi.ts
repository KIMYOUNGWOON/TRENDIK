import {
  DocumentData,
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { getUser } from "./userApi";

export async function getComment(feedId: string | undefined) {
  try {
    const collectionRef = collection(db, "comments");
    const q = query(
      collectionRef,
      where("feedId", "==", feedId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const comments: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      comments.push(doc.data());
    });
    return comments;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function postComment(comment: string, feedId: string | undefined) {
  const authUser = auth.currentUser;
  try {
    if (authUser) {
      const authUserId = authUser.uid;
      const userInfo = await getUser(authUserId);
      const newComment = {
        id: "",
        userId: authUserId,
        userInfo,
        feedId,
        comment,
        likeCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const collectionRef = collection(db, "comments");
      const docRef = await addDoc(collectionRef, newComment);
      await updateDoc(docRef, {
        id: docRef.id,
      });
    }
  } catch (error) {
    console.log(error);
  }
}
