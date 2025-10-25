// Lightweight IndexedDB helper for offline cache
export const dbName = "kolhub_db";
export const storeName = "entries";

export async function openDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(dbName, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveLocal(data: any) {
  const db = await openDB();
  const tx = db.transaction(storeName, "readwrite");
  tx.objectStore(storeName).add(data);
  tx.oncomplete = () => db.close();
}

export async function getAllLocal(): Promise<any[]> {
  const db = await openDB();
  return new Promise((res) => {
    const tx = db.transaction(storeName, "readonly");
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = () => {
      db.close();
      res(req.result);
    };
  });
}
