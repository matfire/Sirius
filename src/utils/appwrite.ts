import { Appwrite, Models } from "appwrite";
import { USER_POSITION_COLLECTION } from "./constants";
import { SiriusDexie } from "./dexieCustom";

// Init your Web SDK
const app = new Appwrite();

app
  .setEndpoint("https://api.nirah.tech/v1") // Your Appwrite Endpoint
  .setProject("618d4b5b761f4"); // Your project ID


const createDocument = async (collectionID:string, data:any, read:Array<string>, write:Array<string>) => {
  await app.database.createDocument(collectionID, "unique()", data, read, write);
};

const createPositionRecord = async (data: IUserPosition , offlineFallback = false) => {
  try {
    await createDocument(
      USER_POSITION_COLLECTION,
      data,
      ["role:all"],
      ["role:member"]
    );
  } catch (error) {
    if (navigator.onLine || !offlineFallback) throw error;
    const db = new SiriusDexie();
    await db.positions.put({ ...data });
  }
};

interface IUserPosition {
  user: string;
  latitude: number;
  longitude: number;
}

type ISSPosition = {
  timestamp: number;
  latitude: number;
  longitude: number;
  onboard: string;
} & Models.Document;

type UserPosition = {
  user: string;
  latitude: number;
  longitude: number;
} & Models.Document

export { app, createPositionRecord };
export type { ISSPosition, UserPosition };

