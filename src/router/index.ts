import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Index",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Index.vue"),
  },
  {
    path: "/add",
    name: "addIndex",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AddIndex.vue"),
    redirect: "/add/bookKeepingAdd",
    children: [
      {
        path: "bookKeepingAdd",
        name: "bookKeeping",
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/bookKeeping/bookKeepingAdd.vue"),
      },
      {
        path: "stockAdd",
        name: "stock",
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/stock/stockAdd.vue"),
      },
    ],
  },
  {
    path: "/setting",
    name: "setting",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/login/setting.vue"),
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
