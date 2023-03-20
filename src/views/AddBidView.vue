<template>
  <div class="container col-8 col-md-4 col-sm-6">
    <h2 class="my-3 border border-secondary border-2 rounded py-3">
      Place Bid (AddBidView.vue)
    </h2>
    <form>
      <input
        type="hidden"
        id="investmentUid"
        name="investmentUid"
        v-model="form.values.investmentUid"
      />
      <div class="row p-1">
        <label for="price">Total Price</label>
        <input
          id="price"
          type="number"
          step="0.01"
          v-model="form.values.price"
          v-on:blur="validate('price')"
        />
        <p class="text-danger" v-if="!!form.errors.price">
          {{ form.errors.price }}
        </p>
      </div>
      <div class="row p-1">
        <label for="quantity">Quantity</label>
        <input
          id="quantity"
          type="number"
          step="1"
          v-model="form.values.quantity"
          v-on:blur="validate('quantity')"
        />
        <p class="text-danger" v-if="!!form.errors.quantity">
          {{ form.errors.price }}
        </p>
      </div>
      <div class="row p-1">
        <label for="deliveryDate">Delivery Date</label>
        <input
          id="deliveryDate"
          type="date"
          v-model="form.values.deliveryDate"
          v-on:blur="validate('deliveryDate')"
        />
      </div>
      <div class="row p-2">
        <button
          class="btn btn-primary"
          type="submit"
          v-on:click.prevent="addBidAction"
        >
          Save Transaction
        </button>
      </div>
    </form>
  </div>
  <SuccessModal
    v-show="showModal"
    @close-modal="redirectBackToSingleAuction(form.values.auction)"
  >
  </SuccessModal>
</template>

<script>
import axios from "axios";
import * as yup from "yup";
import { object } from "yup";

const AddBidActionSchema = object().shape({
  price: yup.number().moreThan(0),
  quantity: yup.number().moreThan(0),
  deliveryDate: yup.date().required(),
});

import SuccessModal from "@/components/organisms/SuccessModal.vue";

export default {
  name: "AddBidView",
  components: {
    SuccessModal,
  },
  data: () => ({
    form: {
      values: {
        price: "",
        quantity: "",
        deliveryDate: "",
        auction: "",
        user: "",
      },
      errors: {
        price: "",
        quantity: "",
        deliveryDate: "",
        auction: "",
        user: "",
      },
    },
    showModal: false,
    passedTicker: "",
  }),
  props: {
    auctionId: String,
  },
  mounted() {},
  methods: {
    redirectBackToSingleAuction(passedId) {
      this.$router.push({
        name: "singleauction",
        params: { auctionId: passedId },
      });
    },
    getUserIdOfJwt() {
      let jwtToken = sessionStorage.getItem("jwt");
      const jwtPayload = atob(jwtToken.split(".")[1]);
      console.log("jwtPayload: " + jwtPayload);
      const parsedPayload = JSON.parse(jwtPayload);
      return parsedPayload.user_id;
    },
    async addBidAction() {
      this.form.values.auction = this.auctionId;
      this.form.values.user = this.getUserIdOfJwt();
      let jwtToken = sessionStorage.getItem("jwt");
      console.log("Start Validation of the Form");
      console.log(this.form.values);
      AddBidActionSchema.validate(this.form.values, {
        abortEarly: false,
      })
        .then(() => {
          console.log("Form is valid");
          this.form.errors = {
            price: "",
            quantity: "",
            deliveryDate: "",
            auction: "",
            user: "",
          };
          try {
            axios
              .post(
                "http://localhost:8080/api/v1/offer/create",
                this.form.values,
                {
                  headers: {
                    Authorization: `Bearer ${jwtToken}`,
                  },
                }
              )
              .then((response) => {
                // Hier dann den Response Verarbeiten -> z.B. zu ein MODAL mit einer Erfolgsnachricht.
                console.log(response);
                this.showModal = true;
              })
              .catch((error) => console.log(error));
          } catch (error) {
            console.log(error);
          }
        })
        .catch((err) => {
          console.log("Form is NOT valid.");
          console.log(err.inner);
          err.inner.forEach((error) => {
            this.form.errors[error.path] = error.message;
          });
        });
      console.log("End Validation of the Form");
    },
    validate(field) {
      AddBidActionSchema.validateAt(field, this.form.values)
        .then(() => {
          this.form.errors[field] = "";
        })
        .catch((error) => {
          this.form.errors[field] = error.message;
        });
    },
  },
};
</script>

<style></style>
