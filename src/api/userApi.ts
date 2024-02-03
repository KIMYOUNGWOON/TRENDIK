import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { FirebaseError } from "firebase/app";
import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { ImageUpload, UpdateData } from "./types";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

interface User {
  email: string;
  password: string;
  name?: string;
  nickName?: string;
}

export async function authSignUp({ email, password, name, nickName }: User) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const newUser = {
      userId: user.uid,
      email,
      name,
      nickName,
      bio: "",
      profileImage: "",
      coverImage: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await setDoc(doc(db, "users", user.uid), newUser);
  } catch (e) {
    if (e instanceof FirebaseError) {
      throw e.code;
    }
  }
}

export async function authSignIn({ email, password }: User) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    if (e instanceof FirebaseError) {
      throw e.code;
    }
  }
}

export async function emailDuplicateCheck(email: string) {
  try {
    const collectionRef = collection(db, "users");
    const q = query(collectionRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  } catch (error) {
    console.log(error);
  }
}

export async function nickNameDuplicateCheck(nickName: string) {
  try {
    const collectionRef = collection(db, "users");
    const q = query(collectionRef, where("nickName", "==", nickName));
    const querySnapshot = await getDocs(q);
    querySnapshot.empty;
    return querySnapshot.empty;
  } catch (error) {
    console.log(error);
  }
}

export async function logOut() {
  await signOut(auth);
  alert("로그아웃 되었습니다.");
}

export async function getUser(userId: string | undefined) {
  try {
    if (userId) {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      return docSnap.data();
    }
  } catch (e) {
    console.log(e);
  }
}

export async function getUsers() {
  const authUser = auth.currentUser;

  if (!authUser) return;

  try {
    const users: DocumentData[] = [];
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("userId", "!=", authUser.uid));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      users.push(doc.data());
    });

    return users;
  } catch (error) {
    console.log(error);
  }
}

export async function updateProfile({ userId, key, value }: UpdateData) {
  try {
    if (userId) {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        [key]: value,
      });
      return await getUser(userId);
    }
  } catch (e) {
    console.log(e);
  }
}

export async function checkNickName(nickName: string) {
  const usersCollectionRef = collection(db, "users");
  const q = query(usersCollectionRef, where("nickName", "==", nickName));

  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  } catch (e) {
    console.log(e);
  }
}

export async function ImageUpload({
  profileImgFile,
  coverImgFile,
}: ImageUpload) {
  const user = auth.currentUser;

  if (user) {
    if (profileImgFile) {
      const profileImageRef = ref(storage, `users/${user.uid}/profile-image`);
      await uploadBytes(profileImageRef, profileImgFile);
      const profileImgURL = await getDownloadURL(profileImageRef);
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        profileImage: profileImgURL,
      });
    }

    if (coverImgFile) {
      const coverImageRef = ref(storage, `users/${user.uid}/cover-image`);
      await uploadBytes(coverImageRef, coverImgFile);
      const coverImgURL = await getDownloadURL(coverImageRef);
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        coverImage: coverImgURL,
      });
    }

    return await getUser(user.uid);
  }
}

export async function imageReset(profileImage: string, coverImage: string) {
  const user = auth.currentUser;
  try {
    if (user) {
      if (profileImage) {
        const profileImageRef = ref(storage, `users/${user.uid}/profile-image`);
        await deleteObject(profileImageRef);
      }

      if (coverImage) {
        const coverImageRef = ref(storage, `users/${user.uid}/cover-image`);
        await deleteObject(coverImageRef);
      }

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        profileImage: "",
        coverImage: "",
      });

      return await getUser(user.uid);
    }
  } catch (error) {
    console.log(error);
  }
}