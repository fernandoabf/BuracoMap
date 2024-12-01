import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import RegisterPothole from "../views/RegisterPothole.vue";
import ViewPotholes from "../views/ViewPotholes.vue";
import Documentation from "../views/Documentation.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/register", component: RegisterPothole },
  { path: "/view", component: ViewPotholes },
  { path: "/documentation", component: Documentation },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
