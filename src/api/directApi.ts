import {
  DocumentData,
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
  onSnapshot,
  arrayUnion,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export async function sendMessage(receiver: string, message: string) {
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

      let roomRef = null;

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.participants.includes(receiver)) {
          roomRef = doc.ref;
        }
      });

      if (!roomRef) {
        const newRoomData = {
          participants: [authUserId, receiver],
          messages: [],
          createdAt: new Date(),
        };
        const docRef = await addDoc(roomsRef, newRoomData);
        roomRef = docRef;
      }

      const messageSchema = {
        sender: authUserId,
        receiver,
        message,
        createdAt: new Date(),
      };
      await updateDoc(roomRef, { messages: arrayUnion(messageSchema) });
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

export function subscribeMessages(
  receiver: string | undefined,
  onUpdate: (messages: DocumentData[]) => void
) {
  const authUser = auth.currentUser;
  if (authUser) {
    const authUserId = authUser.uid;
    const collectionRef = collection(db, "messageRooms");

    const q1 = query(
      collectionRef,
      where("participants", "array-contains", authUserId)
    );

    const q2 = query(
      collectionRef,
      where("participants", "array-contains", receiver)
    );

    const unsubscribe = onSnapshot(q1, (snapshot1) => {
      snapshot1.forEach((doc1) => {
        onSnapshot(q2, (snapshot2) => {
          snapshot2.forEach((doc2) => {
            if (doc1.id === doc2.id) {
              const data = doc1.data();
              if (data.participants.includes(receiver)) {
                onUpdate(data.messages);
              }
            }
          });
        });
      });
    });

    return () => {
      unsubscribe();
    };
  }
}
