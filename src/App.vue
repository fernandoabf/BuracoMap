<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item to="/">
          <v-list-item-title>Início</v-list-item-title>
        </v-list-item>
        <v-list-item to="/register">
          <v-list-item-title>Registrar Buraco</v-list-item-title>
        </v-list-item>
        <v-list-item to="/view">
          <v-list-item-title>Ver Buracos</v-list-item-title>
        </v-list-item>
        <v-list-item to="/documentation">
          <v-list-item-title>Documentação da API</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-btn icon @click="toggleDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      drawer: false,
    };
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
  },
};
</script>

<style scoped></style>
