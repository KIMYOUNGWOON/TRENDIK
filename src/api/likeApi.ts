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

export async function getLikeStatus(type: string, typeId: string | undefined) {
  const authUser = auth.currentUser;
  try {
    if (authUser) {
      const userId = authUser.uid;
      const likeCollection = collection(db, "likes");
      const q = query(
        likeCollection,
        where("userId", "==", userId),
        where(`${type}Id`, "==", typeId)
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
  type: string,
  typeId: string | undefined,
  action: string
) {
  const authUser = auth.currentUser;
  console.log(action);
  try {
    if (authUser && typeId) {
      const userId = authUser.uid;
      const likesCollection = collection(db, "likes");
      const q = query(
        likesCollection,
        where("userId", "==", userId),
        where(`${type}Id`, "==", typeId)
      );
      const querySnapshot = await getDocs(q);
      if (action === "like") {
        if (querySnapshot.empty) {
          const likeSchema = {
            type,
            userId,
            [`${type}Id`]: typeId,
            createdAt: new Date(),
          };
          await addDoc(likesCollection, likeSchema);
          const docRef = doc(db, `${type}s`, typeId);
          await updateDoc(docRef, { likeCount: increment(1) });
        }
      } else {
        if (!querySnapshot.empty) {
          await deleteDoc(querySnapshot.docs[0].ref);
          const docRef = doc(db, `${type}s`, typeId);
          await updateDoc(docRef, { likeCount: increment(-1) });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}
