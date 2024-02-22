import {
  DocumentData,
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export async function getMessages(receiver: string) {
  const authUser = auth.currentUser;
  try {
    if (authUser) {
      const authUserId = authUser.uid;
      const collectionRef = collection(db, "messages");

      const query1 = query(
        collectionRef,
        where("sender", "==", authUserId),
        where("receiver", "==", receiver)
      );
      const snapshot1 = await getDocs(query1);
      const docs1 = snapshot1.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const query2 = query(
        collectionRef,
        where("sender", "==", receiver),
        where("receiver", "==", authUserId)
      );
      const snapshot2 = await getDocs(query2);
      const docs2 = snapshot2.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const combinedDocs = docs1.concat(docs2);
      const sortedDocs = combinedDocs.sort(
        (a: DocumentData, b: DocumentData) =>
          a.createdAt.toDate() - b.createdAt.toDate()
      );

      return sortedDocs;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function sendMessage(receiver: string, message: string) {
  const authUser = auth.currentUser;
  try {
    if (authUser) {
      const sender = authUser.uid;
      const messageSchema = {
        sender,
        receiver,
        message,
        createdAt: new Date(),
      };
      const collectionRef = collection(db, "messages");
      const docRef = await addDoc(collectionRef, messageSchema);
      await updateDoc(docRef, {
        id: docRef.id,
      });
      createMessageRoom(receiver);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function createMessageRoom(receiver: string) {
  const authUser = auth.currentUser;
  try {
    if (authUser) {
      const authUserId = authUser.uid;
      const roomsRef = collection(db, "messageRooms");
      const q = query(
        roomsRef,
        where("participants", "array-contains", authUserId)
      );
      const snapshot = await getDocs(q);

      let roomCheck: boolean = false;

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.participants.includes(receiver)) {
          roomCheck = true;
        }
      });

      if (!roomCheck) {
        const newRoomData = {
          participants: [authUserId, receiver],
          createdAt: new Date(),
        };
        await addDoc(roomsRef, newRoomData);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getMessageRooms() {
  const authUser = auth.currentUser;
  try {
    if (authUser) {
      const authUserId = authUser.uid;
      const roomsRef = collection(db, "messageRooms");
      const q = query(
        roomsRef,
        where("participants", "array-contains", authUserId)
      );
      const snapshot = await getDocs(q);

      const rooms: DocumentData[] = [];

      snapshot.forEach((doc) => {
        rooms.push(doc.data());
      });

      return rooms;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}
