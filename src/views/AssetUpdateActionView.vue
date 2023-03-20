<template>
  <div class="container col-8 col-md-4 col-sm-6">
    <h2 class="my-3 border border-secondary border-2 rounded py-3">
      Update Transaction
    </h2>
    <form>
      <input
        type="hidden"
        id="investmentUid"
        name="investmentUid"
        v-model="form.values.investmentUid"
      />
      <input
        type="hidden"
        id="investmentActionType"
        name="investmentActionType"
        v-model="form.values.investmentActionType"
      />
      <input
        type="hidden"
        id="investmentActionUid"
        name="investmentActionUid"
        v-model="form.values.investmentActionUid"
      />
      <!-- <div class="row p-1">
        <label for="email">Asset Ticker</label>
        <input type="text" v-model="passedTicker" disabled readonly />
      </div> -->
      <div class="row p-1">
        <select
          class="form-select form-select-sm"
          v-model="form.values.investmentActionType"
        >
          <option selected value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>
      </div>
      <div class="row p-1">
        <label for="amount">Amount of Transaction</label>
        <input
          id="amount"
          type="number"
          step="0.01"
          v-model="form.values.amount"
          v-on:blur="validate('amount')"
        />
        <p class="text-danger" v-if="!!form.errors.amount">
          {{ form.errors.amount }}
        </p>
      </div>
      <div class="row p-1">
        <label for="price">Price per Unit</label>
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
        <label for="actionDate">Time of Transaction</label>
        <input
          id="actionDate"
          type="datetime-local"
          v-model="form.values.actionDate"
          v-on:blur="validate('actionDate')"
        />
      </div>

      <div class="row p-2">
        <button
          class="btn btn-primary"
          type="submit"
          v-on:click.prevent="registerAssetAction"
        >
          Save Transaction
        </button>
      </div>
    </form>
  </div>
  <SuccessModal
    v-show="showModal"
    @close-modal="redirectBackToAsset(form.values.investmentUid)"
  >
  </SuccessModal>
</template>

<script>
import axios from "axios";
import * as yup from "yup";
import { object } from "yup";

const AddAssetActionSchema = object().shape({
  investmentActionType: yup.mixed().oneOf(["BUY", "SELL"]),
  amount: yup.number().moreThan(0),
  price: yup.number().moreThan(0),
});

import SuccessModal from "@/components/organisms/SuccessModal.vue";

export default {
  name: "AddAssetActionView",
  components: {
    SuccessModal,
  },
  data: () => ({
    form: {
      values: {
        sessionToken: "",
        userId: "",
        investmentUid: "",
        investmentActionType: "",
        investmentActionUid: "",
        amount: "",
        price: "",
        actionDate: "",
      },
      errors: {
        sessionToken: "",
        userId: "",
        investmentUid: "",
        amount: "",
        price: "",
        actionDate: "",
      },
    },
    showModal: false,
    passedTicker: "",
  }),
  props: {
    assetUid: String,
    actionUid: String,
  },
  created() {
    this.getAllActions();
  },
  methods: {
    redirectBackToAsset(passedUid) {
      this.$router.push({
        name: "detailview",
        params: { assetUid: passedUid },
      });
    },
    async getAllActions() {
      let userId = sessionStorage.getItem("userId");
      let sessionToken = sessionStorage.getItem("sessionToken");
      console.log("start axios searching for 1 action");
      try {
        axios
          .post("http://localhost:56788/api/investment/getAllActions", {
            sessionToken: sessionToken,
            userId: userId,
            investmentuid: this.assetUid,
          })
          .then((response) => {
            console.log(response);
            this.actions = response.data.investmentActions;
            console.log("print response from axios");
            console.log(response.data);
            response.data.investmentActions.forEach((asset) => {
              if (asset.investmentActionUid == this.actionUid) {
                console.log("axios found the action");
                this.form.values.investmentActionType =
                  asset.investmentActionType;
                this.form.values.amount = asset.amount;
                this.form.values.price = asset.price;
                this.form.values.actionDate = asset.actionDate;
              }
            });
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
      console.log("end axios");
    },
    async registerAssetAction() {
      this.form.values.investmentUid = this.assetUid;
      this.form.values.investmentActionUid = this.actionUid;
      this.form.values.sessionToken = sessionStorage.getItem("sessionToken");
      this.form.values.userId = sessionStorage.getItem("userId");
      console.log("Start Validation of the Form");
      AddAssetActionSchema.validate(this.form.values, {
        abortEarly: false,
      })
        .then(() => {
          console.log("Form is valid");
          this.form.errors = {
            sessionToken: "",
            userId: "",
            investmentUid: "",
            amount: "",
            price: "",
            actionDate: "",
          };
          try {
            axios
              .post(
                "http://localhost:56788/api/investment/updateAction",
                this.form.values
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
      AddAssetActionSchema.validateAt(field, this.form.values)
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
