<template>
  <div class="row">
    <h2 class="my-3 border border-secondary border-2 rounded py-3">
      Current Bids
    </h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Buyer</th>
          <th scope="col">Product</th>
          <th scope="col">Total Price</th>
          <th scope="col">Quantity</th>
          <th scope="col">Delivery Date</th>
          <th scope="col">Status</th>
          <th scope="col">Auction End</th>
          <th scope="col">Link</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(bid, i) in userBidData" :key="i">
          <td>{{ bid.auction.user.username }}</td>
          <td>{{ bid.auction.product.name }}</td>
          <td>{{ formatValue(bid.price) + " €" }}</td>
          <td>{{ bid.quantity + " pcs." }}</td>
          <td>{{ bid.deliveryDate }}</td>
          <td>{{ bid.status }}</td>
          <td>{{ formatTimeStamp(bid.auction.endDate) }}</td>
          <td class="pointer" v-on:click="redirectToAuction(bid.auction.id)">
            to Auction
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "UserBidTable",
  data: () => ({
    userBidData: Object,
  }),
  props: {
    userId: String,
  },
  computed: {},
  created() {
    this.getAllUserBids();
  },
  methods: {
    redirectToAuction(passedId) {
      this.$router.push({
        name: "singleauction",
        params: { auctionId: passedId },
      });
    },
    sortingMethod(input) {
      let arr = [];
      let output = [];
      input.forEach((action) => {
        arr.push(action.actionDate);
      });
      arr.sort();
      arr.reverse();
      arr.forEach((string) => {
        input.forEach((action) => {
          if (string == action.actionDate) {
            output.push(action);
          }
        });
      });
      return output;
    },
    formatTimeStamp(input) {
      let output = input.replace("T", " ");
      return output;
    },
    formatValue(input) {
      let output = input.toLocaleString("de-EU", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
      return output;
    },
    getUserIdOfJwt() {
      let jwtToken = sessionStorage.getItem("jwt");
      const jwtPayload = atob(jwtToken.split(".")[1]);
      console.log("jwtPayload: " + jwtPayload);
      const parsedPayload = JSON.parse(jwtPayload);
      return parsedPayload.user_id;
    },
    async getAllUserBids() {
      let jwtToken = sessionStorage.getItem("jwt");
      let userId = this.getUserIdOfJwt();
      try {
        axios
          .get(`http://localhost:8080/api/v1/offer/get/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          })
          .then((response) => {
            this.userBidData = response.data;
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
