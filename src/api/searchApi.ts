import {
  DocumentData,
  addDoc,
  collection,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getUsers } from "./userApi";
import { db } from "../firebase";

export async function userSearch(keyword: string) {
  try {
    console.log("search");
    const users = await getUsers();
    const filteredUsers = users?.filter((user) =>
      user.nickName.includes(keyword)
    );
    return filteredUsers;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function searchFeedsWithTag(tag: string) {
  try {
    const collectionRef = collection(db, "feeds");
    const q = query(collectionRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const feeds = querySnapshot.docs.map((doc) => doc.data());
    const filteredFeeds = feeds.filter((feed) =>
      feed.hashTag.some(
        (hashTagObj: { id: number; hashTag: string }) =>
          hashTagObj.hashTag === tag
      )
    );
    console.log(filteredFeeds);
    return filteredFeeds;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function postKeyword(tag: string) {
  try {
    const collectionRef = collection(db, "keywords");
    const q = query(collectionRef, where("searchTag", "==", tag));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      const docRef = await addDoc(collectionRef, {
        searchTag: tag,
        searchCount: 1,
      });
      await updateDoc(docRef, {
        id: docRef.id,
      });
    } else {
      await updateDoc(querySnapshot.docs[0].ref, {
        searchCount: increment(1),
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getPopularTag() {
  try {
    const collectionRef = collection(db, "keywords");
    const q = query(collectionRef, orderBy("searchCount", "desc"), limit(6));
    const querySnapshot = await getDocs(q);
    const popularTags: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      popularTags.push(doc.data());
    });
    return popularTags;
  } catch (error) {
    console.log(error);
    return [];
  }
}
