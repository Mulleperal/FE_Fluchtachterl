<template>
  <div class="container">
    <AuctionInfo v-bind:pAuctionData="auctionData" v-if="finishedLoading" />
    <AuctionActionBar
      v-bind:auctionId="auctionId"
      v-if="!isOwner && isLogedIn"
    />
    <BitTable
      v-bind:auctionId="auctionId"
      v-bind:isOwnerOfAuction="isOwner"
      v-bind:LogedIn="isLogedIn"
    />
  </div>
</template>

<script>
import AuctionActionBar from "@/components/organisms/AuctionActionBar.vue";
import AuctionInfo from "@/components/organisms/AuctionInfo.vue";
import BitTable from "@/components/organisms/BidTable.vue";

import axios from "axios";

export default {
  name: "SingleAuctionView",
  data: () => ({
    auctionData: Object,
    isOwner: Boolean,
    finishedLoading: Boolean,
    isLogedIn: Boolean,
  }),
  props: {
    auctionId: String,
  },
  methods: {
    checkLoginStatus() {
      if ("jwt" in sessionStorage) {
        return true;
      } else {
        return false;
      }
    },
    checkOwner(username) {
      // Check if the User is Owner:
      let jwtToken = sessionStorage.getItem("jwt");
      const jwtPayload = atob(jwtToken.split(".")[1]);
      console.log("jwtPayload: " + jwtPayload);
      const parsedPayload = JSON.parse(jwtPayload);
      console.log(
        "check if " + username + " matches " + parsedPayload.username
      );
      return username == parsedPayload.username;
    },
    async getAuctionData() {
      console.log("Axios START - getAuctionData()");
      try {
        await axios
          .get(`http://localhost:8080/api/v1/auction/get/${this.auctionId}`)
          .then((response) => {
            console.log(response.data);
            this.auctionData = response.data;
            if (this.checkLoginStatus()) {
              this.isOwner = this.checkOwner(response.data.user.username);
            }
            sessionStorage.getItem("jwt");
            this.finishedLoading = true;
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
      console.log("Axios END - getAuctionData()");
      console.log("LogedIn: " + this.isLogedIn + "// isOwner: " + this.isOwner);
    },
  },
  created() {
    this.finishedLoading = false;
    this.isLogedIn = this.checkLoginStatus();
    console.log("SingleAuctionView mounted");
    this.getAuctionData();
  },
  components: {
    BitTable,
    AuctionInfo,
    AuctionActionBar,
  },
};
</script>
<style></style>
