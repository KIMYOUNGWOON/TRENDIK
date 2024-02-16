import {
  DocumentData,
  DocumentSnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { getUser } from "./userApi";

export async function getComment(commentId: string | undefined) {
  try {
    if (commentId) {
      const commentRef = doc(db, "comments", commentId);
      const docSnap = await getDoc(commentRef);
      const data = docSnap.data();
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getComments(
  feedId: string | undefined,
  pageSize: number,
  lastDoc: DocumentSnapshot | null
): Promise<{
  comments: DocumentData[];
  lastVisible: DocumentSnapshot<DocumentData, DocumentData> | null;
}> {
  try {
    const collectionRef = collection(db, "comments");
    let q = query(
      collectionRef,
      where("feedId", "==", feedId),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(
        collectionRef,
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }

    const querySnapshot = await getDocs(q);
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    const comments: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      comments.push(doc.data());
    });

    return { comments, lastVisible };
  } catch (error) {
    console.log(error);
    return { comments: [], lastVisible: null };
  }
}

export async function postComment(
  type: string,
  content: string,
  feedId: string | undefined
) {
  const authUser = auth.currentUser;
  try {
    if (authUser && feedId) {
      const authUserId = authUser.uid;
      const userInfo = await getUser(authUserId);
      const newComment = {
        id: "",
        userId: authUserId,
        userInfo,
        feedId,
        type,
        [type]: content,
        likeCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const collectionRef = collection(db, "comments");
      const docRef = await addDoc(collectionRef, newComment);
      await updateDoc(docRef, {
        id: docRef.id,
      });
      const feedRef = doc(db, "feeds", feedId);
      await updateDoc(feedRef, {
        commentCount: increment(1),
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function editComment(
  commentId: string | undefined,
  comment: string
) {
  try {
    if (commentId) {
      const docRef = doc(db, "comments", commentId);
      await updateDoc(docRef, { comment });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function deleteComment(
  commentId: string | undefined,
  feedId: string | undefined
) {
  try {
    if (feedId && commentId) {
      await deleteDoc(doc(db, "comments", commentId));
      const feedRef = doc(db, "feeds", feedId);
      await updateDoc(feedRef, {
        commentCount: increment(-1),
      });
    }
  } catch (error) {
    console.log(error);
  }
}
