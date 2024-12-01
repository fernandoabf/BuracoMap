<template>
  <div>
    <v-text-field
      v-model="zipCode"
      label="Digite o CEP"
      clearable
      dense
      :mask="'#####-###'"
      @input="debouncedFilterPotholesByZipCode"
    />

    <div
      id="map"
      style="height: 500px"
    />
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import IndexedDBService from "@/services/IndexedDBService";

export default {
  data() {
    return {
      zipCode: "",
      map: null,
      markers: [],
      debounceTimeout: null,
    };
  },
  watch: {
    zipCode(newZipCode) {
      if (newZipCode) {
        this.filterPotholesByZipCode(this.formatZipCode(newZipCode));
      } else {
        this.loadAllPotholes();
      }
    },
  },
  mounted() {
    this.initializeMap();
    this.loadAllPotholes();
  },
  methods: {
    initializeMap() {
      this.map = L.map("map").setView([0, 0], 2);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        this.map
      );
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

    async loadAllPotholes() {
      const buracos = await IndexedDBService.getAllPotholes();

      console.log("Todos os buracos carregados: ", buracos);

      if (buracos) {
        buracos.forEach((buraco) => {
          buraco.coordenadas.forEach((coordenada) => {
            const { lat, lon } = coordenada;

            const marker = L.marker([lat, lon]).addTo(this.map);

            const popupContent = this.createPopupContent(buraco);
            marker.bindPopup(popupContent);

            this.markers.push(marker);
          });
        });
      }
    },

    async filterPotholesByZipCode(zipCode) {
      console.log("Buscando buracos para o CEP: ", zipCode);

      const buracos = await IndexedDBService.getPotholesByZipCode(zipCode);

      console.log("Buracos encontrados para o CEP: ", buracos);

      this.markers.forEach((marker) => {
        this.map.removeLayer(marker);
      });
      this.markers = [];

      if (buracos && buracos.length > 0) {
        buracos.forEach((buraco) => {
          buraco.coordenadas.forEach((coordenada) => {
            const { lat, lon } = coordenada;

            const marker = L.marker([lat, lon]).addTo(this.map);

            const popupContent = this.createPopupContent(buraco);
            marker.bindPopup(popupContent);

            this.markers.push(marker);
          });
        });

        const firstBuraco = buracos[0];
        const firstCoordenada = firstBuraco.coordenadas[0];
        if (firstCoordenada && firstCoordenada.lat && firstCoordenada.lon) {
          this.map.setView([firstCoordenada.lat, firstCoordenada.lon], 13);
        }
      } else {
        console.log("Nenhum buraco encontrado para este CEP.");
      }
    },

    createPopupContent(buraco) {
      let content = `Buraco em LAT: ${buraco.coordenadas[0].lat}, LONG: ${
        buraco.coordenadas[0].lon
      }<br>Ponto de Referência: ${buraco.referencia || "Não informado"}`;

      if (buraco.foto) {
        content += `<br><img src="${buraco.foto}" alt="Foto do buraco" style="max-width: 100px; max-height: 100px;" />`;
      }

      return content;
    },

    debouncedFilterPotholesByZipCode() {
      clearTimeout(this.debounceTimeout);

      this.debounceTimeout = setTimeout(() => {
        this.filterPotholesByZipCode(this.zipCode);
      }, 500);
    },
  },
};
</script>
