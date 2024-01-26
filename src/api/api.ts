import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";

interface User {
  email: string;
  password: string;
  name?: string;
}

export async function authSignUp({ email, password, name }: User) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log(userCredential);
    await updateProfile(userCredential.user, { displayName: name });
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
  try {
    await signOut(auth);
  } catch (e) {
    if (e instanceof FirebaseError) {
      throw e.code;
    }
  }
}
