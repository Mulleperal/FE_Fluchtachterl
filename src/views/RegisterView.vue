<template>
  <div class="container col-8 col-md-4 col-sm-6">
    <form>
      <div class="row p-1">
        <label for="fname">Your Forename</label>
        <input
          id="fname"
          type="text"
          v-model="form.values.fname"
          v-on:blur="validate('fname')"
        />
        <p class="text-danger" v-if="!!form.errors.fname">
          {{ form.errors.fname }}
        </p>
      </div>
      <div class="row p-1">
        <label for="lname">Your Last Name</label>
        <input
          id="lname"
          type="text"
          v-model="form.values.lname"
          v-on:blur="validate('lname')"
        />
        <p class="text-danger" v-if="!!form.errors.lname">
          {{ form.errors.lname }}
        </p>
      </div>
      <div class="row p-1">
        <label for="email">Your Emai-Address</label>
        <input
          id="email"
          type="email"
          v-model="form.values.email"
          v-on:blur="validate('email')"
        />
        <p class="text-danger" v-if="!!form.errors.email">
          {{ form.errors.email }}
        </p>
      </div>
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
      <div class="row p-1">
        <label for="passwordCheck">Confirm your Password</label>
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
          v-on:click.prevent="registerUser"
        >
          Register
        </button>
      </div>
    </form>
  </div>
  <SuccessModal v-show="showModal" @close-modal="registerEvent"></SuccessModal>
</template>

<script>
import axios from "axios";
import * as yup from "yup";
import { object } from "yup";
const RegisterFormSchemaOnBlur = object().shape({
  fname: yup.string().required(),
  lname: yup.string().required(),
  email: yup.string().email().required(),
  username: yup.string().required(),
  password: yup.string().min(8).required(),
  passwordCheck: yup
    .string()
    .oneOf([yup.ref("password"), null], "Your passwords do not match."),
});

const RegisterFormSchema = object().shape({
  fname: yup.string().required(),
  lname: yup.string().required(),
  email: yup
    .string()
    .email()
    .required()
    .test("Unique Email", "Email already in use", (value) => {
      // false => already taken
      // true => is available
      // console.log(`http://localhost:8080/api/v1/user/available/email/${value}`);

      return new Promise((resolve) => {
        axios
          .get(`http://localhost:8080/api/v1/user/available/email/${value}`)
          .then((response) => {
            if (response.data) {
              console.log(
                `${value} is available. Response is: ${response.data}`
              );
              // this.form.errors.username = "";
            } else {
              console.log(`${value} is taken. Response is: ${response.data}`);
            }
            resolve(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }),
  username: yup
    .string()
    .required()
    .test("Unique Username", "Username already in use", (value) => {
      // false => already taken
      // true => is available
      // console.log(`http://localhost:8080/api/v1/user/available/username/${value}`);

      return new Promise((resolve) => {
        axios
          .get(`http://localhost:8080/api/v1/user/available/username/${value}`)
          .then((response) => {
            if (response.data) {
              console.log(
                `${value} is available. Response is: ${response.data}`
              );
              // this.form.errors.username = "";
            } else {
              console.log(`${value} is taken. Response is: ${response.data}`);
            }
            resolve(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }),
  password: yup.string().min(8).required(),
  passwordCheck: yup
    .string()
    .oneOf([yup.ref("password"), null], "Your passwords do not match."),
});

import SuccessModal from "@/components/organisms/SuccessModal.vue";

export default {
  name: "RegisterView",
  components: {
    SuccessModal,
  },
  data: () => ({
    form: {
      values: {
        fname: "",
        lname: "",
        email: "",
        username: "",
        password: "",
        passwordCheck: "",
      },
      errors: {
        fname: "",
        lname: "",
        email: "",
        username: "",
        password: "",
        passwordCheck: "",
      },
    },
    showModal: false,
  }),
  methods: {
    registerEvent() {
      this.$emit("registerEvent");
    },
    async registerUser() {
      console.log("Start Validation of the Form");
      RegisterFormSchema.validate(this.form.values, {
        abortEarly: false,
      })
        .then(() => {
          console.log("Form is valid");
          this.form.errors = {
            email: "",
            username: "",
            password: "",
            passwordCheck: "",
          };
          try {
            axios
              .post(
                "http://localhost:8080/api/v1/user/register",
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
      RegisterFormSchemaOnBlur.validateAt(field, this.form.values)
        .then(() => {
          this.form.errors[field] = "";
          this.validateDuplicate(field);
        })
        .catch((error) => {
          this.form.errors[field] = error.message;
        });
    },
    validateDuplicate(field) {
      RegisterFormSchema.validateAt(field, this.form.values)
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
