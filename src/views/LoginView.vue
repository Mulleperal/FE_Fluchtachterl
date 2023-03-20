<template>
  <div class="container col-8 col-md-4 col-sm-6">
    <form>
      <div class="row p-1">
        <label for="username">Your Username</label>
        <input
          id="username"
          type="text"
          v-model="form.values.username"
          v-on:blur="validate('username')"
        />
        <p class="text-danger" v-if="!!form.errors.username">
          {{ form.errors.username }}
        </p>
      </div>
      <div class="row p-1">
        <label for="password">Your Password</label>
        <input
          id="password"
          type="password"
          v-model="form.values.password"
          v-on:blur="validate('password')"
        />
        <p class="text-danger" v-if="!!form.errors.password">
          {{ form.errors.password }}
        </p>
      </div>
      <div class="row p-2">
        <button
          class="btn btn-primary"
          type="submit"
          v-on:click.prevent="loginUser"
        >
          Login
        </button>
      </div>
    </form>
    <ErrorModal v-show="showModal" @close-modal="showModal = false">
      You have entered invalid credentials.
    </ErrorModal>
  </div>
</template>

<script>
import axios from "axios";
import * as yup from "yup";
import { object } from "yup";
const LoginFormSchema = object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

import ErrorModal from "@/components/organisms/ErrorModal.vue";

export default {
  name: "LoginView",
  emits: ["loginEvent"],
  components: {
    ErrorModal,
  },
  data: () => ({
    form: {
      values: {
        username: "",
        password: "",
      },
      errors: {
        username: "",
        password: "",
      },
    },
    showModal: false,
  }),
  methods: {
    async loginUser() {
      console.log("Start Validation of the Form");
      LoginFormSchema.validate(this.form.values, {
        abortEarly: false,
      })
        .then(() => {
          console.log("Form is valid");
          this.form.errors = {
            username: "",
            password: "",
          };
          try {
            axios
              .post("http://localhost:8080/api/v1/user/login", this.form.values)
              .then((response) => {
                // Hier dann den Response Verarbeiten -> z.B. zu ein MODAL mit einer Erfolgsnachricht.
                //  {
                //    "userId": "cb399470-e745-489e-81d9-db55a5041862",
                //    "sessionToken": "23bf55a44b6dab0b8a909d9dade5dd2cb7aa3687f9e581e917f0b0e9eb7b490"
                //  }
                sessionStorage.setItem("jwt", response.data.token);
                const jwtPayload = atob(response.data.token.split(".")[1]);
                const parsedPayload = JSON.parse(jwtPayload);
                sessionStorage.setItem("userrole", parsedPayload.permissions);
                this.$emit("loginEvent");
              })
              .catch((error) => {
                console.log(error);
                this.showModal = true;
              });
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
      LoginFormSchema.validateAt(field, this.form.values)
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
