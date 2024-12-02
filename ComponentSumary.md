# Sumário dos Componentes Utilizados

## **1. v-text-field**

- **Descrição**: Componente utilizado para criar campos de texto no formulário.
- **Props principais**:
  - `label`: Define o rótulo visível para o campo de texto. Exemplo: "CEP", "Ponto de Referência".
  - `v-model`: Faz a ligação bidirecional entre o valor do campo de texto e a variável do Vue. Exemplo: `v-model="cep"`.
  - `outlined`: Aplica o estilo de campo de texto com borda visível.
  - `clearable`: Adiciona um ícone para limpar o campo de texto.
  - `mask`: Define a máscara de entrada, como no campo de CEP (formato de máscara como `#####-###`).
- **Função**: Usado para receber entradas de texto do usuário, como o CEP e o ponto de referência.

## **2. v-btn**

- **Descrição**: Componente de botão utilizado para interações do usuário.
- **Props principais**:
  - `color`: Define a cor do botão. Exemplo: `color="primary"`.
  - `outlined`: Cria um botão com borda sem fundo.
  - `@click`: Evento de clique para chamar funções do Vue. Exemplo: `@click="registrarBuraco"`.
  - `disabled`: Desabilita o botão, tornando-o inativo.
- **Função**: Usado para ações como registrar um buraco, abrir o modal para carregar imagens, entre outros.

## **3. v-select**

- **Descrição**: Componente de seleção para permitir ao usuário escolher entre várias opções.
- **Props principais**:
  - `items`: Define os itens que aparecerão no dropdown. Exemplo: `items=["Opção 1", "Opção 2"]`.
  - `v-model`: Liga a seleção feita pelo usuário a uma variável do Vue.
  - `label`: Define o rótulo para o campo de seleção.
- **Função**: Usado para permitir que o usuário selecione opções de listas, como categorias de buracos, ou se a localização foi verificada.

## **4. v-dialog**

- **Descrição**: Componente de diálogo/modal para exibir informações ou solicitar ações do usuário.
- **Props principais**:
  - `v-model`: Controla a visibilidade do diálogo. Exemplo: `v-model="dialogVisible"`.
  - `persistent`: Impede que o diálogo seja fechado ao clicar fora dele.
  - `max-width`: Define a largura máxima do diálogo.
- **Função**: Usado para exibir modais, como a confirmação do envio de um buraco ou para carregar uma foto.

## **5. v-img**

- **Descrição**: Componente para exibir imagens.
- **Props principais**:
  - `src`: Define a URL ou caminho da imagem a ser exibida.
  - `alt`: Texto alternativo para a imagem, caso ela não seja carregada.
  - `contain`: Faz a imagem se ajustar dentro do container sem distorção.
- **Função**: Usado para exibir as imagens carregadas para os buracos registrados, como uma foto do buraco em questão.

## **6. v-card**

- **Descrição**: Componente de cartão para exibir informações de forma organizada e estilizada.
- **Props principais**:
  - `class`: Aplica classes CSS personalizadas para o estilo do cartão.
  - `elevation`: Define a sombra do cartão. Exemplo: `elevation="2"`.
  - `tile`: Remove os cantos arredondados do cartão.
- **Função**: Usado para exibir informações sobre cada buraco, como a descrição, foto, e ponto de referência.

## **7. v-icon**

- **Descrição**: Componente para exibir ícones em formato SVG.
- **Props principais**:
  - `name`: Define o nome do ícone, que pode ser de uma biblioteca como o Material Design Icons. Exemplo: `name="mdi-check-circle"`.
  - `size`: Define o tamanho do ícone. Exemplo: `size="24"`.
- **Função**: Usado para exibir ícones como os de "checagem" para indicar que o buraco foi registrado, ou para mostrar a ação de "limpar" um campo de texto.

## **8. v-app**

- **Descrição**: Componente de layout que define a estrutura básica da aplicação.
- **Props principais**:
  - `app`: Marca o componente como o principal da aplicação.
- **Função**: Envolvem toda a aplicação, garantindo que a navegação, layout e componentes estejam configurados corretamente.

## **9. Leaflet (Biblioteca)**

- **Descrição**: Biblioteca de mapas interativos utilizada para exibir a localização dos buracos no mapa.
- **Função**: Permite o uso de mapas interativos, com marcação de localização e navegação por diferentes camadas de mapa.
- **Métodos principais**:
  - `L.map`: Cria o mapa.
  - `L.marker`: Marca a localização no mapa com um marcador.
  - `L.tileLayer`: Define o tipo de mapa (ex: OpenStreetMap).

## **10. IndexedDB**

- **Descrição**: API do navegador para armazenamento local de dados de forma estruturada.
- **Função**: Usado para armazenar dados de buracos localmente, como a localização e informações associadas, sem a necessidade de um servidor backend.

## **11. v-navigation-drawer**

- **Descrição**: Componente de gaveta de navegação lateral.
- **Props principais**:
  - `v-model`: Controla a visibilidade da gaveta.
  - `absolute`: Torna a gaveta flutuante, fora do fluxo do layout.
- **Função**: Usado para fornecer uma navegação lateral com links para páginas de registro, visualização de buracos, e documentação da API.

## **12. v-list**

- **Descrição**: Componente de lista utilizado para exibir itens em uma lista interativa.
- **Props principais**:
  - `dense`: Reduz a altura dos itens da lista para uma aparência mais compacta.
  - `active-class`: Define a classe CSS que será aplicada quando o item da lista estiver ativo.
- **Função**: Usado para criar listas de itens, como uma lista de buracos registrados ou informações da API.

## **13. v-divider**

- **Descrição**: Componente de linha divisória utilizado para separar seções.
- **Função**: Usado para melhorar a legibilidade da interface, separando seções como "Registro de Buracos" e "Visualização de Buracos".
