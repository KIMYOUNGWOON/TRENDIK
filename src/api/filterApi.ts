import {
  DocumentData,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

export async function filteringFeeds(key: string, value: string) {
  try {
    const collectionRef = collection(db, "feeds");
    const q = query(
      collectionRef,
      where(key, "==", value),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const filteredFeeds: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      filteredFeeds.push(doc.data());
    });

    if (querySnapshot.empty) {
      return [];
    } else {
      return filteredFeeds;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}
