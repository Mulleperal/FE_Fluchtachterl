<template>
  <div class="row">
    <h2 class="my-3 border border-secondary border-2 rounded py-3">
      Auction Info (AuctionInfo.vue)
    </h2>
    <div class="col-4 text-start">
      <h4 class="fw-bold text-decoration-underline">Auction:</h4>
      <h6 class="fw-bold">Owner:</h6>
      <p>{{ pAuctionData.user.username }}</p>
      <p>{{ pAuctionData.user.email }}</p>
      <h6 class="fw-bold">Quantity:</h6>
      <p>
        {{
          "from " +
          pAuctionData.minQuantity +
          " to " +
          pAuctionData.maxQuantity +
          " pcs."
        }}
      </p>
      <h6 class="fw-bold">DeliveryDate:</h6>
      <p>
        {{
          "from " +
          pAuctionData.minDeliveryDate +
          " to " +
          pAuctionData.maxDeliveryDate
        }}
      </p>
      <h6 class="fw-bold">Auction Time:</h6>
      <p>
        {{ "Start:  " + formatTimeStamp(pAuctionData.startDate) }}
      </p>
      <p>
        {{ "End:    " + formatTimeStamp(pAuctionData.endDate) }}
      </p>
    </div>
    <div class="col-4 text-start">
      <h4 class="fw-bold text-decoration-underline">Product:</h4>
      <h6 class="fw-bold">Name:</h6>
      <p>
        {{ pAuctionData.product.name }}
      </p>
      <h6 class="fw-bold">Description:</h6>
      <p>
        {{ pAuctionData.product.description }}
      </p>
      <h6 class="fw-bold">Category:</h6>
      <p>
        {{ pAuctionData.product.category }}
      </p>
    </div>
    <div class="col-4">
      <img alt="Vue logo" src="@/assets/logo.png" />
    </div>
    <!-- TODO:  INFO und BILD einfügen -->
  </div>
</template>

<script>
export default {
  name: "AuctionInfo",
  data: () => ({
    actions: [],
  }),
  methods: {
    formatTimeStamp(input) {
      let output = input.replace("T", " ");
      return output;
    },
  },
  props: {
    pAuctionData: Object,
  },
};
</script>
