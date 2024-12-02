export default {
  createIndexedDB() {
    const request = indexedDB.open("potholeDB", 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("potholes")) {
        const objectStore = db.createObjectStore("potholes", {
          keyPath: "id",
          autoIncrement: true,
        });
        objectStore.createIndex("zipCode", "zipCode", { unique: false }); // Usar apenas o índice de CEP
      }
    };

    request.onsuccess = function (event) {
      console.log("IndexedDB pronto, ", event);
    };

    request.onerror = function (event) {
      console.error("Erro ao abrir o IndexedDB", event);
    };
  },

  saveBuracoToZipCode(zipCode, buraco) {
    const request = indexedDB.open("potholeDB", 1);

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction("potholes", "readwrite");
      const store = transaction.objectStore("potholes");

      // Adiciona o buraco ao store com base no CEP
      buraco.zipCode = zipCode;
      store.add(buraco);
    };

    request.onerror = function (event) {
      console.error("Erro ao salvar o buraco", event);
    };
  },

  getPotholesByZipCode(zipCode) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("potholeDB", 1);

      request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("potholes", "readonly");
        const store = transaction.objectStore("potholes");

        const index = store.index("zipCode"); // Usando o índice de CEP
        const zipCodeRequest = index.getAll(zipCode); // Recupera os buracos com esse CEP

        zipCodeRequest.onsuccess = function () {
          resolve(zipCodeRequest.result);
        };

        zipCodeRequest.onerror = function () {
          reject("Erro ao buscar buracos por CEP");
        };
      };

      request.onerror = function (event) {
        reject("Erro ao abrir o IndexedDB", event);
      };
    });
  },
};
