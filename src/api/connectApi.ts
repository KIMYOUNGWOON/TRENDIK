import {
  OrderByDirection,
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { getUser } from "./userApi";

export async function toggleFollow(
  action: string,
  followingId: string | undefined
) {
  const authUser = auth.currentUser;
  if (!authUser) return;
  console.log(action);
  try {
    const followerId = authUser.uid;
    if (action === "follow") {
      const followsCollection = collection(db, "follows");
      await addDoc(followsCollection, {
        followerId,
        followingId,
        createdAt: new Date(),
      });
    } else {
      const followsCollection = collection(db, "follows");
      const q = query(
        followsCollection,
        where("followerId", "==", followerId),
        where("followingId", "==", followingId)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
      });
    }
  } catch (e) {
    console.log(e);
  }
}

export async function checkFollowStatus(followingId: string | undefined) {
  const authUser = auth.currentUser;
  if (!authUser) return;

  try {
    const followerId = authUser.uid;
    const followsCollection = collection(db, "follows");
    const q = query(
      followsCollection,
      where("followerId", "==", followerId),
      where("followingId", "==", followingId)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.log(error);
  }
}

export async function getFollowers(userId: string | undefined) {
  try {
    const followsCollection = collection(db, "follows");
    const q = query(followsCollection, where("followingId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return [];
    }

    const followerPromises = querySnapshot.docs.map(async (doc) => {
      const followerId: string = doc.data().followerId;
      return await getUser(followerId);
    });
    const followers = await Promise.all(followerPromises);
    return followers;
  } catch (e) {
    console.log(e);
    return [];
  }
}

export async function getFollowings(userId: string | undefined, sort: string) {
  try {
    const followsCollection = collection(db, "follows");
    let q = query(followsCollection);

    if (sort === "basics") {
      q = query(followsCollection, where("followerId", "==", userId));
    } else {
      q = query(
        followsCollection,
        where("followerId", "==", userId),
        orderBy("createdAt", sort as OrderByDirection | undefined)
      );
    }

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return [];
    }

    const followingPromises = querySnapshot.docs.map((doc) => {
      const followingId = doc.data().followingId;
      return getUser(followingId);
    });
    const followings = await Promise.all(followingPromises);

    return followings;
  } catch (e) {
    console.log(e);
    return [];
  }
}
