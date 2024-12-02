<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" offset-sm="3">
        <v-card>
          <v-card-title>Bem-vindo ao BuracoMap</v-card-title>
          <v-card-subtitle>Explore e registre buracos!</v-card-subtitle>
          <v-card-text>
            <p>
              O BuracoMap é uma plataforma colaborativa criada para ajudar os
              usuários a identificar e reportar buracos nas ruas. O objetivo
              deste projeto é fornecer um mapa acessível onde as pessoas podem
              visualizar os buracos registrados e também contribuir adicionando
              novos relatórios.
            </p>
            <p>
              Além disso, a plataforma oferece uma API para que outras
              aplicações possam integrar os dados dos buracos, facilitando para
              desenvolvedores utilizarem essas informações em suas próprias
              soluções. Junte-se a nós na missão de deixar nossas ruas mais
              seguras!
            </p>
          </v-card-text>
          <v-card-actions>
            <v-row class="d-flex flex-wrap justify-center" no-gutters>
              <v-col cols="12" sm="auto" class="d-flex justify-center mb-2">
                <v-btn to="/register" color="primary"> Registrar Buraco </v-btn>
              </v-col>
              <v-col cols="12" sm="auto" class="d-flex justify-center mb-2">
                <v-btn to="/view" color="secondary"> Ver Buracos </v-btn>
              </v-col>
              <v-col cols="12" sm="auto" class="d-flex justify-center">
                <v-btn to="/documentation" color="grey">
                  Documentação da API
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-card-text {
  margin-bottom: 20px;
}
</style>
