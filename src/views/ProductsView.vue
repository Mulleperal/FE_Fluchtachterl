<template>
  <div class="container">
    <div class="row">
      <h2 class="my-3 border border-secondary border-2 rounded py-3">
        Products 
      </h2>
      <div class="mb-3" v-if="checkAdmin()">
        <button
          v-on:click="$router.push('/addProduct')"
          class="btn btn-primary ms-2"
        >
          Add Product
        </button>
      </div>
      <ProductCard
        v-for="(product, i) in products"
        :key="i"
        v-bind:cardData="product"
        v-bind:logedIn="isLogedIn"
        v-bind:isAdmin="isAdmin"
      />
    </div>
  </div>
</template>

<script>
import ProductCard from "@/components/molecules/productCard.vue";
import axios from "axios";

export default {
  name: "ProductsView",
  data: () => ({
    products: [],
    isLogedIn: Boolean,
    isAdmin: Boolean
  }),
  computed: {},
  created() {
    this.getAllProducts();
    this.isLogedIn = this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      if ("jwt" in sessionStorage) {
        return true;
      } else {
        return false;
      }
    },
    checkAdmin() {
      console.log(sessionStorage)
      if (sessionStorage.getItem('userrole') == 'Admin') {
        return true
      }
      return false
    }
    ,
    async getAllProducts() {
      console.log("start axios");
      try {
        axios
          .get("http://localhost:8080/api/v1/product/getAll")
          .then((response) => {
            console.log(response);
            this.products = response.data;
            console.log("print response from axios");
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
      console.log("end axios");
      console.log("Products: " + this.products);
    },
  },
  components: { ProductCard },
};
</script>

<style></style>
