<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" offset-sm="3">
        <v-card>
          <v-card-title>Visualizar Buracos</v-card-title>

          <v-text-field
            v-model="zipCode"
            label="Digite o CEP"
            clearable
            dense
            @input="handleZipCodeSearch"
          />

          <MapBuraco :zip-code="zipCode" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MapBuraco from "@/components/Map.vue";

export default {
  components: {
    MapBuraco,
  },
  data() {
    return {
      zipCode: "",
    };
  },
  methods: {
    handleZipCodeSearch() {
      console.log(`Buscando buracos para o CEP: ${this.zipCode}`);
    },
  },
};
</script>
