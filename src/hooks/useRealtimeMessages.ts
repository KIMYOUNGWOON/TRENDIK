import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  collection,
  query,
  where,
  onSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase";

function useRealtimeMessages(authUserId: string, userId: string | undefined) {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<DocumentData[]>([]);

  useEffect(() => {
    if (!authUserId || !userId) return;

    const messagesRef = collection(db, "messages");
    const q1 = query(
      messagesRef,
      where("sender", "==", authUserId),
      where("receiver", "==", userId)
    );
    const q2 = query(
      messagesRef,
      where("sender", "==", userId),
      where("receiver", "==", authUserId)
    );

    const unsubscribe1 = onSnapshot(q1, (snapshot) => {
      updateMessages(snapshot.docs);
    });

    const unsubscribe2 = onSnapshot(q2, (snapshot) => {
      updateMessages(snapshot.docs);
    });

    function updateMessages(newDocs: DocumentData[]) {
      setMessages((prev: DocumentData[]) => {
        const updatedMessages = [
          ...prev,
          ...newDocs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ];
        return updatedMessages.sort(
          (a, b) => a.createdAt.toDate() - b.createdAt.toDate()
        );
      });
    }

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, [authUserId, userId, queryClient]);

  // React Query의 캐시를 업데이트
  useEffect(() => {
    queryClient.setQueryData(
      ["messagesSent", `${authUserId}-${userId}`],
      messages
    );
  }, [messages, authUserId, userId, queryClient]);
}

export default useRealtimeMessages;
