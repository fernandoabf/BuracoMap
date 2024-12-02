<template>
  <div>
    <v-text-field
      v-model="zipCode"
      label="Digite o CEP"
      clearable
      dense
      maxlength="9"
      :mask="'#####-###'"
      @input="debouncedFilterPotholesByZipCode"
    />

    <div id="map" style="height: 500px" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import IndexedDBService from "@/services/IndexedDBService";

// Variáveis reativas
const zipCode = ref("");
const map = ref(null);
const markers = ref([]);
let debounceTimeout = null;

// Inicializar o mapa
const initializeMap = () => {
  map.value = L.map("map").setView([0, 0], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
    map.value
  );
};

// Formatar o CEP
const formatZipCode = (inputZipCode) => {
  const formattedZipCode = inputZipCode.replace(/\D/g, ""); // Remove tudo que não for número
  const limitedZipCode = formattedZipCode.slice(0, 8); // Limita a 8 caracteres

  if (limitedZipCode.length === 8) {
    return `${limitedZipCode.slice(0, 5)}-${limitedZipCode.slice(5)}`;
  }
  console.log(`input: ${inputZipCode}, return: ${limitedZipCode}`);
  return limitedZipCode; // Retorna o código sem formatação
};

// Carregar todos os buracos
const loadAllPotholes = async () => {
  const buracos = await IndexedDBService.getAllPotholes();
  console.log("Todos os buracos carregados: ", buracos);

  markers.value.forEach((marker) => map.value.removeLayer(marker));
  markers.value = [];

  if (buracos) {
    buracos.forEach((buraco) => {
      buraco.coordenadas.forEach((coordenada) => {
        const { lat, lon } = coordenada;
        const marker = L.marker([lat, lon]).addTo(map.value);
        const popupContent = createPopupContent(buraco);
        marker.bindPopup(popupContent);
        markers.value.push(marker);
      });
    });
  }
};

// Filtrar buracos pelo CEP
const filterPotholesByZipCode = async (zipCode) => {
  console.log("Buscando buracos para o CEP: ", zipCode);

  const buracos = await IndexedDBService.getPotholesByZipCode(zipCode);
  console.log("Buracos encontrados para o CEP: ", buracos);

  markers.value.forEach((marker) => map.value.removeLayer(marker));
  markers.value = [];

  if (buracos && buracos.length > 0) {
    buracos.forEach((buraco) => {
      buraco.coordenadas.forEach((coordenada) => {
        const { lat, lon } = coordenada;
        const marker = L.marker([lat, lon]).addTo(map.value);
        const popupContent = createPopupContent(buraco);
        marker.bindPopup(popupContent);
        markers.value.push(marker);
      });
    });

    const firstBuraco = buracos[0];
    const firstCoordenada = firstBuraco.coordenadas[0];
    if (firstCoordenada && firstCoordenada.lat && firstCoordenada.lon) {
      map.value.setView([firstCoordenada.lat, firstCoordenada.lon], 13);
    }
  } else {
    console.log("Nenhum buraco encontrado para este CEP.");
  }
};

// Criar conteúdo do popup
const createPopupContent = (buraco) => {
  let content = `Buraco em LAT: ${buraco.coordenadas[0].lat}, LONG: ${
    buraco.coordenadas[0].lon
  }<br>Ponto de Referência: ${buraco.referencia || "Não informado"}`;

  if (buraco.foto) {
    content += `<br><img src="${buraco.foto}" alt="Foto do buraco" style="max-width: 100px; max-height: 100px;" />`;
  }

  return content;
};

// Debounced função para busca de buracos
const debouncedFilterPotholesByZipCode = () => {
  clearTimeout(debounceTimeout);

  debounceTimeout = setTimeout(() => {
    const formattedZip = formatZipCode(zipCode.value);
    zipCode.value = formattedZip; // Atualiza com o formato correto
    filterPotholesByZipCode(formattedZip);
  }, 500);
};

// Watch para mudanças no zipCode
watch(zipCode, (newZipCode) => {
  if (newZipCode) {
    const formattedZip = formatZipCode(newZipCode);
    zipCode.value = formattedZip; // Atualiza o zipCode com a formatação
    filterPotholesByZipCode(formattedZip);
  } else {
    loadAllPotholes();
  }
});

// Montado
onMounted(() => {
  initializeMap();
  loadAllPotholes();
});
</script>
