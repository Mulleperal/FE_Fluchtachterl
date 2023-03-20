<template>
  <div class="container col-8 col-md-4 col-sm-6">
    <form>
      <div class="row p-1">
        <label for="currentPassword">Current Password</label>
        <input
          id="currentPassword"
          type="password"
          v-model="form.values.currentPassword"
          v-on:blur="validate('currentPassword')"
        />
        <p class="text-danger" v-if="!!form.errors.currentPassword">
          {{ form.errors.currentPassword }}
        </p>
      </div>
      <div class="row p-1">
        <label for="password">New Password</label>
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
      <div class="row p-1">
        <label for="passwordCheck">Confirm new Password</label>
        <input
          id="passwordCheck"
          type="password"
          v-model="form.values.passwordCheck"
          v-on:blur="validate('passwordCheck')"
        />
        <p class="text-danger" v-if="!!form.errors.passwordCheck">
          {{ form.errors.passwordCheck }}
        </p>
      </div>
      <div class="row p-2">
        <button
          class="btn btn-primary"
          type="submit"
          v-on:click.prevent="changePassword"
        >
          Change Password
        </button>
      </div>
    </form>
  </div>
  <SuccessModal
    v-show="showModal"
    @close-modal="changeUserDataEvent"
  ></SuccessModal>
</template>

<script>
import axios from "axios";
import * as yup from "yup";
import { object } from "yup";

const PasswordFormSchema = object().shape({
  currentPassword: yup.string().required(),
  password: yup.string().min(8).required(),
  passwordCheck: yup
    .string()
    .oneOf([yup.ref("password"), null], "Your passwords do not match."),
});

import SuccessModal from "@/components/organisms/SuccessModal.vue";

export default {
  name: "EditUserDataForm",
  components: {
    SuccessModal,
  },
  data: () => ({
    form: {
      values: {
        userId: "",
        currentPassword: "",
        password: "",
        passwordCheck: "",
      },
      errors: {
        userId: "",
        currentPassword: "",
        password: "",
        passwordCheck: "",
      },
    },
    showModal: false,
  }),
  props: {
    inputName: String,
  },
  created() {
    console.log("inputName is " + this.inputName);
    this.form.values.userId = this.getUserIdOfJwt;
  },
  methods: {
    changeUserDataEvent() {
      this.$router.push({
        name: "userprofil",
      });
    },
    getUserIdOfJwt() {
      let jwtToken = sessionStorage.getItem("jwt");
      const jwtPayload = atob(jwtToken.split(".")[1]);
      console.log("jwtPayload: " + jwtPayload);
      const parsedPayload = JSON.parse(jwtPayload);
      return parsedPayload.user_id;
    },
    async changePassword() {
      console.log("Start Validation of the Form");
      let jwtToken = sessionStorage.getItem("jwt");
      let userId = this.getUserIdOfJwt();
      PasswordFormSchema.validate(this.form.values, {
        abortEarly: false,
      })
        .then(() => {
          console.log("Form is valid");
          this.form.errors = {
            userId: "",
            currentPassword: "",
            password: "",
            passwordCheck: "",
          };
          try {
            axios
              .post(
                `http://localhost:8080/api/v1/user/edit/password/${userId}`,
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
      PasswordFormSchema.validateAt(field, this.form.values)
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
