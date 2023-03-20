<template>
  <div class="container">
    <UserBidTable v-bind:auctionId="auctionId" />
  </div>
</template>

<script>
import UserBidTable from "@/components/organisms/UserBidTable.vue";

export default {
  name: "MyBidView",
  data: () => ({}),
  props: {
    auctionId: String,
  },
  methods: {},
  created() {
    console.log("SingleAuctionView mounted");
  },
  components: {
    UserBidTable,
  },
};
</script>
<style></style>
