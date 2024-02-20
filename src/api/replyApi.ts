import {
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { getUser } from "./userApi";

export async function getReplies(commentId: string) {
  try {
    const collectionRef = collection(db, "replies");
    const q = query(
      collectionRef,
      where("commentId", "==", commentId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const replies: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      replies.push(doc.data());
    });

    if (querySnapshot.empty) {
      return [];
    }

    return replies;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function postingReply(
  feedId: string | undefined,
  commentId: string,
  reply: string
) {
  const authUser = auth.currentUser;
  try {
    if (authUser) {
      const authUserId = authUser.uid;
      const authUserInfo = await getUser(authUserId);
      const replySchema = {
        id: "",
        userId: authUserId,
        userInfo: authUserInfo,
        feedId,
        commentId,
        reply,
        createdAt: new Date(),
        updatedAt: new Date(),
        fresh: false,
      };
      const docRef = await addDoc(collection(db, "replies"), replySchema);
      await updateDoc(docRef, { id: docRef.id });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function editReply(replyId: string | undefined, reply: string) {
  try {
    if (replyId) {
      const docRef = doc(db, "replies", replyId);
      await updateDoc(docRef, { reply, updatedAt: new Date() });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function deleteReply(replyId: string | undefined) {
  try {
    if (replyId) {
      await deleteDoc(doc(db, "replies", replyId));
    }
  } catch (error) {
    console.log(error);
  }
}
