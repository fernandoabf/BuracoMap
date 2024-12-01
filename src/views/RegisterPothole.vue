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
                  @input="formatZipCode"
                  @blur="handleBlur"
                  @keyup.enter="handleEnter"
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
                  v-model="image"
                  label="Carregar Foto do Buraco"
                  accept="image/*"
                  dense
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

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import IndexedDBService from "@/services/IndexedDBService";

export default {
  data() {
    return {
      zipCode: "",
      referencePoint: "",
      lat: null,
      lon: null,
      map: null,
      marker: null,
      selectedCity: "",
      selectedState: "",
      image: null,
      snackbar: false,
    };
  },
  mounted() {
    this.initializeMap();
    IndexedDBService.createIndexedDB(); // Inicializar o IndexedDB
  },
  methods: {
    initializeMap() {
      this.$nextTick(() => {
        this.map = L.map("map").setView([0, 0], 2);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
          this.map
        );
        this.marker = L.marker([0, 0]).addTo(this.map);

        this.map.on("click", (e) => {
          this.lat = e.latlng.lat;
          this.lon = e.latlng.lng;
          this.marker.setLatLng([this.lat, this.lon]);
          this.fetchAddressByCoordinates(this.lat, this.lon);
        });
      });
    },

    formatZipCode() {
      let formattedZipCode = this.zipCode.replace(/\D/g, "");
      if (formattedZipCode.length === 8) {
        this.zipCode = `${formattedZipCode.slice(
          0,
          5
        )}-${formattedZipCode.slice(5)}`;
      } else {
        this.zipCode = formattedZipCode;
      }
    },

    async handleBlur() {
      await this.fetchAddressByZipCode();
    },

    async handleEnter() {
      await this.fetchAddressByZipCode();
    },

    async fetchAddressByZipCode() {
      const query = this.zipCode.replace(/\D/g, "");
      if (query.length === 8) {
        try {
          const response = await fetch(
            `https://viacep.com.br/ws/${query}/json/`
          );
          const data = await response.json();

          if (data.localidade && data.uf) {
            this.selectedCity = data.localidade;
            this.selectedState = data.uf;
            this.fetchCoordinatesFromOpenStreetMap(data.localidade, data.uf);
          }
        } catch (error) {
          console.error("Erro ao buscar endereço:", error);
        }
      }
    },

    async fetchCoordinatesFromOpenStreetMap(city, state) {
      const searchQuery = `${city}, ${state}`;
      const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json&addressdetails=1&limit=1`;

      try {
        const response = await fetch(geocodeUrl);
        const data = await response.json();

        if (data && data[0]) {
          this.lat = parseFloat(data[0].lat);
          this.lon = parseFloat(data[0].lon);
          this.map.setView([this.lat, this.lon], 13);
          this.marker.setLatLng([this.lat, this.lon]);
        }
      } catch (error) {
        console.error("Erro ao obter coordenadas:", error);
      }
    },

    async convertImageToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },

    async submitForm() {
      if (this.lat && this.lon) {
        let imageBase64 = null;

        if (this.image) {
          imageBase64 = await this.convertImageToBase64(this.image);
        }

        const buraco = {
          coordenadas: [{ lat: this.lat, lon: this.lon }],
          referencia: this.referencePoint,
          foto: imageBase64,
          zipCode: this.zipCode,
        };

        IndexedDBService.saveBuracoToCity(
          this.selectedCity,
          this.selectedState,
          buraco
        );

        console.log(
          `Buraco registrado em ${this.selectedCity}, ${this.selectedState}`
        );

        this.snackbar = true;
      }
    },

    async searchByZipCode() {
      if (this.zipCode) {
        try {
          const potholes = await IndexedDBService.getPotholesByZipCode(
            this.zipCode
          );
          console.log(potholes);
          if (potholes.length > 0) {
            this.showPotholesOnMap(potholes);
          } else {
            alert("Nenhum buraco encontrado para este CEP.");
          }
        } catch (error) {
          console.error("Erro ao buscar buracos por CEP:", error);
        }
      } else {
        alert("Digite um CEP válido.");
      }
    },

    showPotholesOnMap(potholes) {
      potholes.forEach((buraco) => {
        const newMarker = L.marker([
          buraco.coordenadas[0].lat,
          buraco.coordenadas[0].lon,
        ])
          .addTo(this.map)
          .bindPopup(
            `Ponto de Referência: ${buraco.referencia || "Não informado"}`
          );

        newMarker.openPopup();
      });
    },
  },
};
</script>
