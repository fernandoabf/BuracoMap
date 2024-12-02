<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" offset-sm="3">
        <v-card>
          <v-card-title>API Documentation</v-card-title>
          <v-card-subtitle>
            <p>
              Use the following endpoints to interact with the pothole data:
            </p>
            <ul>
              <li><strong>GET /potholes</strong> - List all potholes</li>
              <li><strong>POST /potholes</strong> - Register a new pothole</li>
              <li>
                <strong>GET /potholes?cep={cep}</strong> - List potholes by ZIP
                code
              </li>
            </ul>
            <h3>Example Request and Response:</h3>
            <p><strong>GET /potholes</strong></p>
            <pre>
[
  {
    "id": 1,
    "coordenadas": [
      { "lat": -23.55052, "lon": -46.633308 }
    ],
    "referencia": "Próximo ao banco central",
    "foto": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAABAAEAAA...",
    "cep": "01000-000"
  }
]
            </pre>
            <p><strong>POST /potholes</strong></p>
            <pre>
{
  "coordenadas": [{ "lat": -23.55052, "lon": -46.633308 }],
  "referencia": "Em frente ao shopping",
  "foto": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAABAAEAAA...",
  "cep": "01000-000"
}
            </pre>
            <p><strong>GET /potholes?cep=01000-000</strong></p>
            <pre>
[
  {
    "id": 1,
    "coordenadas": [
      { "lat": -23.55052, "lon": -46.633308 }
    ],
    "referencia": "Próximo ao banco central",
    "foto": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAABAAEAAA...",
    "cep": "01000-000"
  }
]
            </pre>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

