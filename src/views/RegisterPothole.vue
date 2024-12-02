<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" offset-sm="3">
        <v-card>
          <v-card-title>Registrar um Buraco</v-card-title>
          <v-form>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="zipCode"
                  label="Digite o CEP"
                  clearable
                  dense
                  maxlength="9"
                  @input="formatZipCode"
                  @blur="fetchAddressByZipCode"
                  @keyup.enter="fetchAddressByZipCode"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="referencePoint"
                  label="Ponto de Referência (opcional)"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-file-input
                  label="Carregar Foto do Buraco"
                  accept="image/*"
                  dense
                  @change="onFileChange"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <div id="map" style="height: 300px; width: 100%" />
              </v-col>
            </v-row>

            <v-row class="d-flex justify-center mb-3">
              <v-col cols="auto">
                <v-btn
                  color="primary"
                  class="mx-2"
                  elevation="2"
                  @click="submitForm"
                >
                  Registrar
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn
                  color="secondary"
                  class="mx-2"
                  elevation="2"
                  @click="searchByZipCode"
                >
                  Buscar Buracos
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" color="success" timeout="4000">
      Buraco registrado com sucesso!
      <v-btn color="pink" text @click="snackbar = false"> Fechar </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import IndexedDBService from "@/services/IndexedDBService";

const zipCode = ref("");
const referencePoint = ref("");
const lat = ref(null);
const lon = ref(null);
const map = ref(null);
const marker = ref(null);
const image = ref(null);
const snackbar = ref(false);

// Inicializar o mapa
const initializeMap = async () => {
  await nextTick();
  map.value = L.map("map").setView([0, 0], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
    map.value
  );

  marker.value = L.marker([0, 0]).addTo(map.value);

  map.value.on("click", (e) => {
    lat.value = e.latlng.lat;
    lon.value = e.latlng.lng;
    marker.value.setLatLng([lat.value, lon.value]);
  });
};

// Formatar o CEP
const formatZipCode = () => {
  let formattedZipCode = zipCode.value.replace(/\D/g, "");
  if (formattedZipCode.length === 8) {
    zipCode.value = `${formattedZipCode.slice(0, 5)}-${formattedZipCode.slice(
      5
    )}`;
  } else {
    zipCode.value = formattedZipCode;
  }
};

// Buscar endereço pelo CEP
const fetchAddressByZipCode = async () => {
  const query = zipCode.value.replace(/\D/g, "");
  if (query.length === 8) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${query}/json/`);
      const data = await response.json();
      if (data.localidade && data.uf) {
        fetchCoordinatesFromOpenStreetMap(data.localidade, data.uf);
      }
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
    }
  }
};

// Buscar coordenadas no OpenStreetMap
const fetchCoordinatesFromOpenStreetMap = async (city, state) => {
  const searchQuery = `${city}, ${state}`;
  const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json&addressdetails=1&limit=1`;

  try {
    const response = await fetch(geocodeUrl);
    const data = await response.json();
    if (data && data[0]) {
      lat.value = parseFloat(data[0].lat);
      lon.value = parseFloat(data[0].lon);
      map.value.setView([lat.value, lon.value], 13);
      marker.value.setLatLng([lat.value, lon.value]);
    }
  } catch (error) {
    console.error("Erro ao obter coordenadas:", error);
  }
};

// Manipular upload de imagem
const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      image.value = event.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Enviar formulário
const submitForm = async () => {
  if (lat.value && lon.value) {
    const buraco = {
      coordenadas: [{ lat: lat.value, lon: lon.value }],
      referencia: referencePoint.value,
      foto: image.value, // Certifique-se de que a foto seja válida ou nula
      zipCode: zipCode.value,
    };

    if (!buraco.coordenadas || !buraco.zipCode) {
      console.error("Coordenadas ou CEP estão faltando.");
      return;
    }

    console.log("Objeto buraco:", buraco); // Verifique o conteúdo do objeto

    await IndexedDBService.saveBuracoToZipCode(buraco.zipCode, buraco);
    snackbar.value = true;
  } else {
    console.error("Coordenadas não definidas.");
  }
};

// Buscar buracos por CEP
const searchByZipCode = async () => {
  try {
    const potholes = await IndexedDBService.getPotholesByZipCode(zipCode.value);
    if (potholes.length > 0) {
      potholes.forEach((buraco) => {
        L.marker([buraco.coordenadas[0].lat, buraco.coordenadas[0].lon])
          .addTo(map.value)
          .bindPopup(
            `Ponto de Referência: ${buraco.referencia || "Não informado"}`
          )
          .openPopup();
      });
    } else {
      alert("Nenhum buraco encontrado para este CEP.");
    }
  } catch (error) {
    console.error("Erro ao buscar buracos por CEP:", error);
  }
};

onMounted(() => {
  initializeMap();
  IndexedDBService.createIndexedDB();
});
</script>
