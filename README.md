# BuracoMap - Mapeador de Buracos

## Descrição

O **BuracoMap** é uma plataforma para o registro e visualização de buracos em ruas, permitindo que cidadãos colaborem no mapeamento de problemas de infraestrutura urbana. A aplicação permite registrar informações sobre o buraco, como localização, ponto de referência e fotos, além de visualizar os buracos registrados em um mapa interativo.

## Componentes

### 1. **Registrar um Buraco**

- **Objetivo**: Permite ao usuário registrar um buraco informando o CEP, ponto de referência e carregando uma foto.
- **Funcionalidades**:
  - Entrada de CEP com formatação automática.
  - Busca de endereço e coordenadas através do CEP.
  - Mapa interativo com Leaflet para seleção de coordenadas.
  - Upload de imagem.
  - Armazenamento local dos dados em IndexedDB.

### 2. **Ver Buracos**

- **Objetivo**: Exibe os buracos registrados em um mapa interativo.
- **Funcionalidades**:
  - Visualização de buracos usando o Leaflet.
  - Filtro de buracos por CEP com exibição das localizações no mapa.
  - Exibição de informações detalhadas (ponto de referência e foto).
  - Pesquisa com debouncing para otimizar a performance.

### 3. **Página Principal (Home)**

- **Objetivo**: Apresenta informações sobre o projeto e links de navegação para registrar e visualizar buracos, além da documentação da API.
- **Funcionalidades**:
  - Informações sobre o objetivo do projeto.
  - Links para as funcionalidades de registro de buracos, visualização e documentação.

### 4. **Documentação da API**

- **Objetivo**: Fornece informações sobre como usar a API do projeto.
- **Funcionalidades**:
  - Endpoints RESTful documentados, como `GET /potholes`, `POST /potholes`, e `GET /potholes?cep={cep}`.
  - Exemplos de requisições e respostas em formato JSON.

## Tecnologias

- **Vue.js** (Frontend)
- **Vuetify** (Design)
- **Leaflet** (Mapas interativos)
- **IndexedDB** (Armazenamento local)

## Como Rodar o Projeto

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
