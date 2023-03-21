<template>
  <div class="container">
    <div class="row">
      <h2 class="my-3 border border-secondary border-2 rounded py-3">
        Auctions Overview
      </h2>


      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">Buyer</th>
            <th scope="col">Product</th>
            <th scope="col">Quantity</th>
            <th scope="col">DeliveryTime</th>
            <th scope="col">Auction Start</th>
            <th scope="col">Auction End</th>
            <!--<th scope="col"># Offers</th>-->
            <th scope="col">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(auction, i) in auctionData" :key="i">
            <td>{{ auction.user.username }}</td>
            <td>{{ auction.product.name }}</td>
            <td>
              {{ auction.minQuantity + " to " + auction.maxQuantity + "pcs." }}
            </td>
            <td>
              {{ auction.minDeliveryDate + " to " + auction.maxDeliveryDate }}
            </td>
            <td>{{ formatTimeStamp(auction.startDate) }}</td>
            <td>{{ formatTimeStamp(auction.endDate) }}</td>
            <!--<td>{{ auction.offers.length }}</td>-->
            <td class="pointer" v-on:click="redirectToAuction(auction.id)">
              Detail
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DashboardView",
  components: {},
  data: () => ({
    auctionData: Object,
  }),
  methods: {
    formatTimeStamp(input) {
      let output = input.replace("T", " ");
      return output;
    },
    redirectToAuction(passedId) {
      this.$router.push({
        name: "singleauction",
        params: { auctionId: passedId },
      });
    },
    async getAuctionData() {
      let jwtToken = sessionStorage.getItem("jwt");
      console.log("start axios");
      try {
        axios
          .get("http://localhost:8080/api/v1/auction/getAll", {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          })
          .then((response) => {
            this.auctionData = response.data;
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
      console.log("end axios");
    },
  },
  computed: {},
  created() {
    this.getAuctionData();
  },
};
</script>

<style>
.pointer {
  cursor: pointer;
}
</style>
