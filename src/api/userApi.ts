import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { FirebaseError } from "firebase/app";
import {
  DocumentData,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { ImageUpload, User } from "./types";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

export async function authSignUp({
  email,
  password,
  name,
  nickName,
  gender,
  height,
  weight,
  shoesSize,
}: User) {
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
      gender,
      height,
      weight,
      shoesSize,
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

export async function getUser(userId: string) {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    return data;
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

    if (querySnapshot.empty) {
      return [];
    } else {
      return users;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function updateProfile(updateData: { [x: string]: string }) {
  const authUser = auth.currentUser;

  if (!authUser) return;

  try {
    const userId = authUser.uid;
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, updateData);
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
  try {
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
      return getUser(user.uid);
    }
  } catch (error) {
    console.log(error);
    return null;
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

      return getUser(user.uid);
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function deleteAccount() {
  const authUser = auth.currentUser;
  try {
    if (authUser) {
      await deleteUser(authUser);
      const docRef = doc(db, "users", authUser.uid);
      await deleteDoc(docRef);
    }
  } catch (error) {
    console.log(error);
  }
}
