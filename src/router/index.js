import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import RegisterView from "../views/RegisterView.vue";
import LoginView from "../views/LoginView.vue";
import AuctionsView from "../views/AuctionsView.vue";
import ImpressumView from "../views/ImpressumView.vue"
import HelpView from "../views/HelpView.vue"

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/imprint",
    name: "imprint",
    component: ImpressumView,
  },
  {
    path: "/help",
    name: "help",
    component: HelpView,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/auctions",
    name: "auctions",
    component: AuctionsView,
  },
  {
    path: "/userprofil",
    name: "userprofil",
    component: () => import("../views/UserprofileView.vue"),
  },
  {
    path: "/useredit/:inputName",
    name: "useredit",
    component: () => import("../views/EditUserDataForm.vue"),
    props: true,
  },
  {
    path: "/passwordedit",
    name: "passwordedit",
    component: () => import("../views/EditUserPasswordForm.vue"),
    props: true,
  },
  {
    path: "/usercontrol",
    name: "usercontrol",
    component: () => import("../views/UserControlView.vue"),
  },
  {
    path: "/products",
    name: "products",
    component: () => import("../views/ProductsView.vue"),
  },
  {
    path: "/addProduct",
    name: "addProduct",
    component: () => import("../views/AddProductView.vue"),
  },
  {
    path: "/editProduct/:productId",
    name: "editProduct",
    component: () => import("../views/AddProductView.vue"),
  },
  {
    path: "/product/:productId/addAuction",
    name: "addAuction",
    component: () => import("../views/AddAuctionView.vue"),
    props: true,
  },
  {
    path: "/mybids",
    name: "mybids",
    component: () => import("../views/MyBidView.vue"),
  },
  {
    path: "/auction/:auctionId",
    children: [
      {
        path: "",
        name: "singleauction",
        component: () => import("../views/SingleAuctionView.vue"),
        props: true,
      },
      {
        path: "/auction/:auctionId/addbid",
        name: "addBid",
        component: () => import("../views/AddBidView.vue"),
        props: true,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
