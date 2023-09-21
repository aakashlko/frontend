import Dexie from "dexie";

const db = new Dexie("RecordingDatabase");
db.version(1).stores({
  recordings: "recId,  recBlob",
});
db.open().catch(function (e) {
  console.error("Open failed: " + e);
});
export const insertData = async ({ recId, blob }) => {
  try {
    await db.friends.add({
      recId: recId,
      recBlob: blob,
    });
  } catch (e) {
    alert(`Error: ${e}`);
  }
};
