<template>
  <div class="col p-1 border m-1">
    <p class="text-muted">{{ cardData.category }}</p>
    <h6 class="fw-bold">{{ cardData.name }}</h6>
    <img
        :src="require('@/assets/' + imageName)"
        :alt="imageName"
        :width="128"
        :height="128"
    />
    <p>{{ cardData.description }}</p>
    <button
        v-if="this.logedIn"
        v-on:click.prevent="redirectToCreateAuction(cardData.id)"
        class="btn btn-primary ms-2 my-2"
    >

      create Auction
    </button>

    <button v-if="isAdmin && this.logedIn"
            class="btn btn-primary ms-2 my-2"
            v-on:click="$router.push(`../editProduct/${cardData.id}`)">
      Edit Product
    </button>

    <button v-if="isAdmin && this.logedIn"
            class="btn btn-danger ms-2 my-2"
            v-on:click="deleteProduct(cardData.id)">
      Delete Product
    </button>

  </div>
</template>

<script>


export default {
  name: "productCard",

  props: {
    cardData: Object,
    logedIn: Boolean,
    isAdmin: Boolean,
  },
  methods: {
    redirectToCreateAuction(passedId) {
      this.$router.push({
        name: "addAuction",
        params: {productId: passedId},
      });
    },
    async deleteProduct(productId) {
      let jwtToken = sessionStorage.getItem("jwt");
      await fetch(`http://localhost:8080/api/v1/product/delete/${productId}`, {
        method: 'DELETE',
        headers: {Authorization: `Bearer ${jwtToken}`,},
      }).then(
          () => {
            // alerts Admin and refreshes component
            alert('Item deleted')
            this.$router.go()
          }
      );
    }

  },
  computed: {

    imageName() {
      if (!this.cardData.img) {
        return "logo.png";
      } else {
        return `${this.cardData.img}`;
      }
    }
  },
};
</script>
