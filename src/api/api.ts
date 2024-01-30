import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { FirebaseError } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { ImageUpload, UpdateData, UserType } from "./types";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log(user);
  } catch (e) {
    if (e instanceof FirebaseError) {
      throw e.code;
    }
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
    return docSnap.data();
  } catch (e) {
    console.log(e);
  }
}

export async function getUsers(userId: string) {
  try {
    const users: UserType[] = [];
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("userId", "!=", userId));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      users.push({ ...(doc.data() as UserType) });
    });

    return users;
  } catch (e) {
    console.log(e);
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
