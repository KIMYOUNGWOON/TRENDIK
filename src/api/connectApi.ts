import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { getUser } from "./userApi";

export async function follow(followingId: string | undefined) {
  const authUser = auth.currentUser;
  if (!authUser) return;

  try {
    const followerId = authUser.uid;
    const followsCollection = collection(db, "follows");
    await addDoc(followsCollection, {
      followerId,
      followingId,
      createdAt: new Date(),
    });
  } catch (e) {
    console.log(e);
  }
}

export async function unFollow(followingId: string | undefined) {
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
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
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
  const authUser = auth.currentUser;
  if (!authUser) return;

  try {
    const followsCollection = collection(db, "follows");
    const q = query(followsCollection, where("followingId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return [];
    }

    const followerPromises = querySnapshot.docs.map((doc) => {
      const followerId = doc.data().followerId;
      return getUser(followerId);
    });
    const followers = await Promise.all(followerPromises);
    return followers;
  } catch (e) {
    console.log(e);
  }
}

export async function getFollowings(userId: string | undefined) {
  try {
    const followsCollection = collection(db, "follows");
    const q = query(followsCollection, where("followerId", "==", userId));
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
  }
}
