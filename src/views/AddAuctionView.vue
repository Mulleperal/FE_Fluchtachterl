<template>
  <div class="container col-8 col-md-4 col-sm-6">
    <h2 class="my-3 border border-secondary border-2 rounded py-3">
      Place Bid
    </h2>
    <form>
      <div class="row p-1">
        <div class="col">
          <div class="row pe-1">
            <label for="minPrice">Min Price</label>
            <input
              id="minPrice"
              type="number"
              step="0.01"
              v-model="form.values.minPrice"
              v-on:blur="validate('minPrice')"
            />
            <p class="text-danger" v-if="!!form.errors.minPrice">
              {{ form.errors.minPrice }}
            </p>
          </div>
        </div>
        <div class="col">
          <div class="row ps-1">
            <label for="maxPrice">Max Price</label>
            <input
              id="maxPrice"
              type="number"
              step="0.01"
              v-model="form.values.maxPrice"
              v-on:blur="validate('maxPrice')"
            />
            <p class="text-danger" v-if="!!form.errors.maxPrice">
              {{ form.errors.maxPrice }}
            </p>
          </div>
        </div>
      </div>
      <div class="row p-1">
        <div class="col">
          <div class="row pe-1">
            <label for="minQuantity">Min Quantity</label>
            <input
              id="minQuantity"
              type="number"
              step="1"
              v-model="form.values.minQuantity"
              v-on:blur="validate('minQuantity')"
            />
            <p class="text-danger" v-if="!!form.errors.minQuantity">
              {{ form.errors.minQuantity }}
            </p>
          </div>
        </div>
        <div class="col">
          <div class="row ps-1">
            <label for="maxQuantity">Max Quantity</label>
            <input
              id="maxQuantity"
              type="number"
              step="1"
              v-model="form.values.maxQuantity"
              v-on:blur="validate('maxQuantity')"
            />
            <p class="text-danger" v-if="!!form.errors.maxQuantity">
              {{ form.errors.maxQuantity }}
            </p>
          </div>
        </div>
      </div>
      <div class="row p-1">
        <div class="col">
          <div class="row pe-1">
            <label for="minDeliveryDate">Min DeliveryDate</label>
            <input
              id="minDeliveryDate"
              type="date"
              v-model="form.values.minDeliveryDate"
              v-on:blur="validate('minDeliveryDate')"
            />
            <p class="text-danger" v-if="!!form.errors.minDeliveryDate">
              {{ form.errors.minDeliveryDate }}
            </p>
          </div>
        </div>
        <div class="col">
          <div class="row ps-1">
            <label for="maxDeliveryDate">Max DeliveryDate</label>
            <input
              id="maxDeliveryDate"
              type="date"
              v-model="form.values.maxDeliveryDate"
              v-on:blur="validate('maxDeliveryDate')"
            />
            <p class="text-danger" v-if="!!form.errors.maxDeliveryDate">
              {{ form.errors.maxDeliveryDate }}
            </p>
          </div>
        </div>
      </div>
      <div class="row p-1">
        <div class="col">
          <div class="row pe-1">
            <label for="startDate">Start Date</label>
            <input
              id="startDate"
              type="datetime-local"
              v-model="form.values.startDate"
              v-on:blur="validate('startDate')"
            />
            <p class="text-danger" v-if="!!form.errors.startDate">
              {{ form.errors.startDate }}
            </p>
          </div>
        </div>
        <div class="col">
          <div class="row ps-1">
            <label for="endDate">End Date</label>
            <input
              id="endDate"
              type="datetime-local"
              v-model="form.values.endDate"
              v-on:blur="validate('endDate')"
            />
            <p class="text-danger" v-if="!!form.errors.endDate">
              {{ form.errors.endDate }}
            </p>
          </div>
        </div>
      </div>
      <div class="row p-2">
        <button
          class="btn btn-primary"
          type="submit"
          v-on:click.prevent="createAuction"
        >
          Save Transaction
        </button>
      </div>
    </form>
  </div>
  <SuccessModal
    v-show="showModal"
    @close-modal="redirectBackToSingleAuction(form.createdAuctionId)"
  >
  </SuccessModal>
</template>

<script>
import axios from "axios";
import * as yup from "yup";
import { object } from "yup";

/*
  
    "sessionToken": "string",
    "userId": "string",
    "investmentUid": "string",
    "investmentActionType": "BUY",
    "amount": 0,
    "price": 0,
    "actionDate": "2023-01-05T15:12:13.380Z"
  */
const CreateAuctionSchema = object().shape({
  product: yup.string().required(),
  user: yup.string().required(),
  minPrice: yup.number().moreThan(0),
  maxPrice: yup.number().moreThan(0),
  minQuantity: yup.number().moreThan(0),
  maxQuantity: yup.number().moreThan(0),
  minDeliveryDate: yup.date().required(),
  maxDeliveryDate: yup.date().required(),
  startDate: yup.string().required(),
  endDate: yup.string().required(),
});

import SuccessModal from "@/components/organisms/SuccessModal.vue";

export default {
  name: "AddAuctionView",
  components: {
    SuccessModal,
  },
  data: () => ({
    form: {
      values: {
        product: "",
        user: "",
        minPrice: "",
        maxPrice: "",
        minQuantity: "",
        maxQuantity: "",
        minDeliveryDate: "",
        maxDeliveryDate: "",
        startDate: "",
        endDate: "",
      },
      errors: {
        product: "",
        user: "",
        minPrice: "",
        maxPrice: "",
        minQuantity: "",
        maxQuantity: "",
        minDeliveryDate: "",
        maxDeliveryDate: "",
        startDate: "",
        endDate: "",
      },
    },
    showModal: false,
    createdAuctionId: "",
  }),
  props: {
    productId: String,
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
    async createAuction() {
      this.form.values.product = this.productId;
      this.form.values.user = this.getUserIdOfJwt();
      let jwtToken = sessionStorage.getItem("jwt");
      console.log("Start Validation of the Form");
      console.log(this.form.values);
      CreateAuctionSchema.validate(this.form.values, {
        abortEarly: false,
      })
        .then(() => {
          console.log("Form is valid");
          this.form.errors = {
            product: "",
            user: "",
            minPrice: "",
            maxPrice: "",
            minQuantity: "",
            maxQuantity: "",
            minDeliveryDate: "",
            maxDeliveryDate: "",
            startDate: "",
            endDate: "",
          };
          try {
            axios
              .post(
                "http://localhost:8080/api/v1/auction/create",
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
                this.form.createdAuctionId = response.data.id;
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
      CreateAuctionSchema.validateAt(field, this.form.values)
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
