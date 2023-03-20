<template>
  <div class="row">
    <h2 class="my-3 border border-secondary border-2 rounded py-3">
      Current Bids (BidTable.vue)
    </h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Seller</th>
          <th scope="col">TimeStamp</th>
          <th scope="col">Total Price</th>
          <th scope="col">Quantity</th>
          <th scope="col">Delivery Date</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(bids, i) in auctionBidData" :key="i">
          <!-- <td colspan="4">{{ action }}</td> -->
          <td>{{ bids.user.username }}</td>
          <td>{{ formatTimeStamp(bids.created) }}</td>
          <td>{{ formatValue(bids.price) + " €" }}</td>
          <td>{{ bids.quantity + " pcs." }}</td>
          <td>{{ bids.deliveryDate }}</td>
          <td>{{ bids.status }}</td>
          <td>
            <button
              v-if="
                this.isOwnerOfAuction &&
                this.LogedIn &&
                bids.status == 'PENDING'
              "
              v-on:click.prevent="acceptOffer(bids.id)"
              class="btn btn-success ms-2"
            >
              ACCEPT
            </button>
          </td>
          <td>
            <button
              v-if="
                this.isOwnerOfAuction &&
                this.LogedIn &&
                bids.status == 'PENDING'
              "
              v-on:click.prevent="rejectOffer(bids.id)"
              class="btn btn-danger ms-2"
            >
              REJECT
            </button>
          </td>
          <td
            class="pointer"
            v-if="this.userBidView"
            v-on:click="redirectToAuction(auctionId)"
          >
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
  name: "BidTable",
  data: () => ({
    auctionBidData: Object,
  }),
  props: {
    auctionId: String,
    isOwnerOfAuction: Boolean,
    LogedIn: Boolean,
  },
  computed: {},
  created() {
    this.getAllBids();
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
    changeBidStatus(status, offerId) {
      this.auctionBidData.find((item) => item.id === offerId).status = status;
    },
    async rejectOffer(offerId) {
      console.log("SingleAuctionView mounted");
      let jwtToken = sessionStorage.getItem("jwt");
      try {
        axios
          .get(`http://localhost:8080/api/v1/offer/reject/${offerId}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          })
          .then((response) => {
            this.auctionData = response.data;
            this.changeBidStatus("REJECTED", offerId);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    },
    async acceptOffer(offerId) {
      console.log("SingleAuctionView mounted");
      let jwtToken = sessionStorage.getItem("jwt");
      try {
        axios
          .get(`http://localhost:8080/api/v1/offer/accept/${offerId}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          })
          .then((response) => {
            this.auctionData = response.data;
            this.changeBidStatus("ACCEPTED", offerId);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    },
    async getAllBids() {
      let jwtToken = sessionStorage.getItem("jwt");
      try {
        axios
          .get(
            `http://localhost:8080/api/v1/offer/get/auction/${this.auctionId}`,
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          )
          .then((response) => {
            this.auctionBidData = response.data;
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
