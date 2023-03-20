<template>
  <div class="col p-1 border m-1">
    <p class="text-muted">{{ cardData.category }}</p>
    <h6 class="fw-bold">{{ cardData.name }}</h6>
    <img
      :src="require('@/assets' + imageName)"
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
  </div>
</template>

<script>
// import image from "@/assets/logo.png";
export default {
  name: "productCard",
  /*   data: function () {
    return {
      image: image,
    };
  }, */
  props: {
    cardData: Object,
    logedIn: Boolean,
  },
  methods: {
    redirectToCreateAuction(passedId) {
      this.$router.push({
        name: "addAuction",
        params: { productId: passedId },
      });
    },
  },
  computed: {
    imageName() {
      let path = this.cardData.img;
      if (path == null) {
        return "/logo.png";
      }
      //path = path.slice(9, -4);
      return path;
    },
  },
};
</script>
