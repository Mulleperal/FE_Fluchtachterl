<template>
  <div class="row">
    <h2 class="my-3 border border-secondary border-2 rounded py-3">
      Asset ({{ this.assetData.symbol }})
    </h2>
    <div class="text-start">
      Current Price in EUR is
      <strong class="text-success">{{ assetValue }} </strong>
      EUR.
    </div>
    <div class="col-10"><canvas id="myChart"></canvas></div>
    <div class="col-2 d-flex justify-content-center align-items-center">
      <button
        class="btn btn-primary"
        v-on:click.prevent="addToPortfolio(assetUid, assetData.symbol)"
        v-if="isLogedIn"
      >
        Add Transaction
      </button>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import axios from "axios";

export default {
  name: "CryptoDetailView",
  data: () => ({
    showModal: false,
    actions: [],
  }),
  props: {
    assetData: Object,
    assetUid: String,
  },
  methods: {
    addToPortfolio(passedUid, passedTicker) {
      console.log("Ticker = " + passedTicker);
      this.$router.push({
        name: "addAssetView",
        params: {
          assetUid: passedUid,
          assetTicker: passedTicker,
        },
      });
    },
    formatValue(input) {
      let output = input.toLocaleString("de-EU", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
      return output;
    },
  },
  computed: {
    isLogedIn() {
      if ("userId" in sessionStorage) {
        return true;
      } else {
        return false;
      }
    },
    assetValue() {
      let value = parseFloat(this.assetData.currentValue);
      return this.formatValue(value);
    },
  },
  beforeUpdate() {
    if (this.isLogedIn) {
      let userId = sessionStorage.getItem("userId");
      let sessionToken = sessionStorage.getItem("sessionToken");
      try {
        axios
          .post("http://localhost:56788/api/investment/getAllActions", {
            sessionToken: sessionToken,
            userId: userId,
            investmentuid: this.assetUid,
          })
          .then((response) => {
            this.actions = response.data.investmentActions;
            console.log(this.actions);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    }
    console.log("CryptoDetailView mounted!");
    console.log(this.assetData);
    const ctx = document.getElementById("myChart");

    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            data: this.assetData.data,
            label: "Value",
            borderColor: "rgb(75,179,253)",
          },
        ],
      },
      options: {
        scales: {
          x: {
            display: true,
            // reverse: true,
            title: {
              display: true,
              text: "Day(s)",
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: "Value in EUR",
            },
          },
        },
      },
    });
    myChart;
  },
};
</script>

<style></style>
