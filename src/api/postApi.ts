import {
  DocumentData,
  DocumentSnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { FeedUpdateData, PostData } from "./types";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { getUser } from "./userApi";

export async function uploadFeed(postData: PostData) {
  const authUser = auth.currentUser;

  try {
    if (authUser) {
      const userId = authUser.uid;

      const feedData = {
        id: "",
        userId: userId,
        content: postData.content,
        feedImages: [],
        gender: postData.gender,
        style: postData.style,
        commentCount: 0,
        likeCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const collectionRef = collection(db, "feeds");
      const docRef = await addDoc(collectionRef, feedData);
      await updateDoc(docRef, {
        id: docRef.id,
      });

      const imageUploadPromises = postData.imageFiles.map(
        async (file, index) => {
          const feedImageRef = ref(
            storage,
            `feeds/${docRef.id}/feed-image${index}`
          );
          await uploadBytes(feedImageRef, file);
          return getDownloadURL(feedImageRef);
        }
      );

      const images = await Promise.all(imageUploadPromises);

      await updateDoc(docRef, { feedImages: images });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getAllFeeds(
  pageSize: number = 6,
  lastDoc: DocumentSnapshot | null = null
) {
  try {
    const collectionRef = collection(db, "feeds");
    let q = query(collectionRef, orderBy("createdAt", "desc"), limit(pageSize));

    if (lastDoc) {
      q = query(
        collectionRef,
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }

    const querySnapshot = await getDocs(q);

    let lastVisible = null;

    if (querySnapshot.empty) {
      lastVisible = null;
    } else {
      lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    }

    const feedPromises = querySnapshot.docs.map(async (doc) => {
      const feedData = { ...doc.data() };
      feedData.userInfo = await getUser(feedData.userId);
      return feedData;
    });

    const feedList = await Promise.all(feedPromises);

    return { feedList, lastVisible };
  } catch (error) {
    console.log(error);
    return { feedList: [], lastVisible: null };
  }
}

export async function getUserFeeds(userId: string | undefined) {
  try {
    if (userId) {
      const feeds: DocumentData[] = [];
      const collectionRef = collection(db, "feeds");
      const q = query(
        collectionRef,
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return [];
      }

      querySnapshot.forEach((doc) => {
        feeds.push(doc.data());
      });
      return feeds;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getFeed(postId: string | undefined) {
  try {
    if (postId) {
      const docRef = doc(db, "feeds", postId);
      const docSnap = await getDoc(docRef);
      const feed = docSnap.data();
      const feedData = { ...feed };
      feedData.userInfo = await getUser(feed?.userId);

      return feedData;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function editFeed(
  postId: string | undefined,
  updateData: FeedUpdateData
) {
  try {
    if (postId) {
      if (updateData.imageFiles.length === 0) {
        const data = {
          content: updateData.content,
          gender: updateData.gender,
          style: updateData.style,
          updatedAt: new Date(),
        };
        const docRef = doc(db, "feeds", postId);
        await updateDoc(docRef, data);
        const updatedFeed = await getFeed(postId);
        return updatedFeed;
      } else {
        for (let i = 0; i < updateData.preImagesCount; i++) {
          const desertRef = ref(storage, `feeds/${postId}/feed-image${i}`);
          await deleteObject(desertRef);
        }

        const imageUploadPromises = updateData.imageFiles.map(
          async (file, index) => {
            const feedImageRef = ref(
              storage,
              `feeds/${postId}/feed-image${index}`
            );
            if (typeof file !== "string") {
              await uploadBytes(feedImageRef, file);
            }
            return getDownloadURL(feedImageRef);
          }
        );
        const images = await Promise.all(imageUploadPromises);
        const data = {
          content: updateData.content,
          gender: updateData.gender,
          style: updateData.style,
          feedImages: images,
          updatedAt: new Date(),
        };
        const docRef = doc(db, "feeds", postId);
        await updateDoc(docRef, data);
        const updatedFeed = await getFeed(postId);
        return updatedFeed;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFeed(
  postId: string | undefined,
  feedImageCount: number
) {
  try {
    if (postId) {
      const docRef = doc(db, "feeds", postId);
      await deleteDoc(docRef);

      for (let i = 0; i < feedImageCount; i++) {
        const desertRef = ref(storage, `feeds/${postId}/feed-image${i}`);
        await deleteObject(desertRef);
      }
    }
  } catch (error) {
    console.log(error);
  }
}