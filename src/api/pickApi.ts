import {
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export async function getUserPicks() {
  const authUser = auth.currentUser;
  try {
    if (authUser) {
      const userId = authUser.uid;
      const collectionRef = collection(db, "picks");
      const q = query(collectionRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const picks: DocumentData[] = [];
      querySnapshot.forEach((doc) => {
        picks.push(doc.data());
      });
      return picks;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getPickStatus(feedId: string) {
  const authUser = auth.currentUser;
  try {
    if (authUser) {
      const userId = authUser.uid;
      const collectionRef = collection(db, "picks");
      const q = query(
        collectionRef,
        where("userId", "==", userId),
        where("feedId", "==", feedId)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return false;
      } else {
        return true;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export async function togglePickFeed(
  action: string,
  feedId: string,
  feedImages: string[]
) {
  console.log(action);
  const authUser = auth.currentUser;
  try {
    if (authUser) {
      const userId = authUser.uid;
      const collectionRef = collection(db, "picks");
      const q = query(
        collectionRef,
        where("userId", "==", userId),
        where("feedId", "==", feedId)
      );
      const querySnapshot = await getDocs(q);
      if (action === "pick") {
        if (querySnapshot.empty) {
          const pickData = {
            userId,
            feedId,
            feedImages,
            createAt: new Date(),
          };
          const docRef = await addDoc(collectionRef, pickData);
          await updateDoc(docRef, {
            id: docRef.id,
          });
        }
      } else {
        if (!querySnapshot.empty) {
          await deleteDoc(querySnapshot.docs[0].ref);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}
