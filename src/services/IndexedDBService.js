export default {
  // Função para inicializar o IndexedDB
  createIndexedDB() {
    const request = indexedDB.open("potholeDB", 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("potholes")) {
        const objectStore = db.createObjectStore("potholes", {
          keyPath: "id",
          autoIncrement: true,
        });
        objectStore.createIndex("zipCode", "zipCode", { unique: false });
      }
    };

    request.onsuccess = function (event) {
      console.log("IndexedDB pronto, ", event);
    };

    request.onerror = function (event) {
      console.error("Erro ao abrir o IndexedDB", event);
    };
  },

  // Função para salvar um buraco no banco de dados, associando um CEP
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

  // Função para buscar buracos por CEP
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

  // Função para buscar todos os buracos (sem filtro por CEP)
  getAllPotholes() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("potholeDB", 1);

      request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("potholes", "readonly");
        const store = transaction.objectStore("potholes");

        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = function () {
          resolve(getAllRequest.result);
        };

        getAllRequest.onerror = function () {
          reject("Erro ao buscar todos os buracos");
        };
      };

      request.onerror = function (event) {
        reject("Erro ao abrir o IndexedDB", event);
      };
    });
  },

  // Função para excluir um buraco por seu ID
  deletePotholeById(id) {
    const request = indexedDB.open("potholeDB", 1);

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction("potholes", "readwrite");
      const store = transaction.objectStore("potholes");

      const deleteRequest = store.delete(id); // Exclui o buraco pelo ID

      deleteRequest.onsuccess = function () {
        console.log("Buraco excluído com sucesso");
      };

      deleteRequest.onerror = function () {
        console.error("Erro ao excluir o buraco", event);
      };
    };

    request.onerror = function (event) {
      console.error("Erro ao abrir o IndexedDB", event);
    };
  },

  // Função para atualizar um buraco
  updatePothole(buraco) {
    const request = indexedDB.open("potholeDB", 1);

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction("potholes", "readwrite");
      const store = transaction.objectStore("potholes");

      const updateRequest = store.put(buraco); // Atualiza o buraco existente com a mesma chave

      updateRequest.onsuccess = function () {
        console.log("Buraco atualizado com sucesso");
      };

      updateRequest.onerror = function () {
        console.error("Erro ao atualizar o buraco", event);
      };
    };

    request.onerror = function (event) {
      console.error("Erro ao abrir o IndexedDB", event);
    };
  },
};
