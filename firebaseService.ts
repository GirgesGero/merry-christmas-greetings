import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { ChristmasContent } from "../types";

/**
 * حفظ بيانات المستخدم في Firestore
 */
export const saveUserToFirebase = async (name: string) => {
  try {
    await addDoc(collection(db, "users"), {
      name: name.trim(),
      createdAt: serverTimestamp(), // ⏱️ توقيت السيرفر (الأفضل)
    });
  } catch (error) {
    console.error("Error saving user to Firebase:", error);
    throw error;
  }
};

/**
 * اختيار محتوى عشوائي للمعايدة
 */
export const getRandomContent = (
  contents: ChristmasContent[]
): ChristmasContent => {
  return contents[Math.floor(Math.random() * contents.length)];
};
