<template>
  <div class="row">
    <div class="my-3 py-3">
      <button
        v-on:click="redirectToAddBidView(auctionId)"
        class="btn btn-primary ms-2"
      >
        Place Bid
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "AuctionActionBar",
  data: () => ({
    actions: [],
  }),
  methods: {
    redirectToAddBidView(passedId) {
      this.$router.push({
        name: "addBid",
        params: { auctionId: passedId },
      });
    },
  },
  props: {
    auctionId: String,
  },
};
</script>
