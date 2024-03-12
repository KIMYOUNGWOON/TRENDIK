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
  doc,
  deleteDoc,
  orderBy,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { getUser } from "./userApi";
import { Message } from "./types";

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
        const authUserInfo = await getUser(authUserId);
        const contactUserInfo = await getUser(receiver);
        const newRoomData = {
          participants: [authUserId, receiver],
          participantsInfo: [authUserInfo, contactUserInfo],
          visible: [authUserId, receiver],
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const docRef = await addDoc(roomsRef, newRoomData);
        await updateDoc(docRef, { id: docRef.id });
        roomRef = docRef;
      }

      const messageSchema = {
        sender: authUserId,
        receiver,
        message,
        readBy: [authUserId],
        createdAt: new Date(),
      };
      await updateDoc(roomRef, {
        updatedAt: new Date(),
        messages: arrayUnion(messageSchema),
      });
      const docSnap = await getDoc(roomRef);
      if (docSnap.exists()) {
        if (!docSnap.data().visible.includes(receiver)) {
          await updateDoc(roomRef, {
            updatedAt: new Date(),
            visible: arrayUnion(receiver),
          });
        }
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
        where("participants", "array-contains", authUserId),
        orderBy("updatedAt", "desc")
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

export function subscribeToMessageRooms(
  updateRooms: (rooms: DocumentData[]) => void
) {
  const authUser = auth.currentUser;
  if (authUser) {
    const authUserId = authUser.uid;
    const roomsRef = collection(db, "messageRooms");
    const q = query(
      roomsRef,
      where("participants", "array-contains", authUserId),
      orderBy("updatedAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rooms: DocumentData[] = [];
      snapshot.forEach((doc) => {
        rooms.push(doc.data());
      });
      updateRooms(rooms);
    });

    return () => {
      unsubscribe();
    };
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

export async function readMessage(
  receiver: string | undefined,
  authUserId: string
) {
  try {
    const collectionRef = collection(db, "messageRooms");

    const q1 = query(
      collectionRef,
      where("participants", "array-contains", authUserId)
    );
    const snapshot1 = await getDocs(q1);

    snapshot1.forEach(async (doc) => {
      const roomData = doc.data();

      if (roomData.participants.includes(receiver)) {
        const updatedMessages = roomData.messages.map((message: Message) => {
          if (!message.readBy.includes(authUserId)) {
            return { ...message, readBy: [...message.readBy, authUserId] };
          } else {
            return message;
          }
        });
        await updateDoc(doc.ref, { messages: updatedMessages });
      }
    });
  } catch (error) {
    console.log(error);
  }
}

export async function leaveMessageRoom(roomId: string | undefined) {
  const authUser = auth.currentUser;
  try {
    if (authUser && roomId) {
      const authUserId = authUser.uid;
      const roomRef = doc(db, "messageRooms", roomId);
      await updateDoc(roomRef, { visible: arrayRemove(authUserId) });
      const docSnap = await getDoc(roomRef);
      if (docSnap.exists()) {
        const roomData = docSnap.data();
        const updatedMessages = roomData.messages.map((message: Message) => {
          if (!message.readBy.includes(authUserId)) {
            return { ...message, readBy: [...message.readBy, authUserId] };
          } else {
            return message;
          }
        });
        await updateDoc(roomRef, { messages: updatedMessages });
        const visible = roomData.visible;
        if (visible.length === 0) {
          await deleteDoc(roomRef);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}
