<template>
  <div class="container col-8 col-md-4 col-sm-6">
    <h2 class="my-3 border border-secondary border-2 rounded py-3">
      Edit User Data
    </h2>
    <form>
      <div class="row p-1">
        <div class="col me-1">
          <div class="row">
            <label for="fnameOld">Current Forename</label>
            <input
              id="fnameOld"
              type="text"
              v-model="form.valuesOld.fname"
              disabled
            />
          </div>
        </div>
        <div class="col ms-1">
          <div class="row">
            <label for="fname">New Forename</label>
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
        </div>
      </div>

      <div class="row p-1">
        <div class="col me-1">
          <div class="row">
            <label for="lnameOld">Current Last Name</label>
            <input
              id="lnameOld"
              type="text"
              v-model="form.valuesOld.lname"
              disabled
            />
          </div>
        </div>
        <div class="col ms-1">
          <div class="row">
            <label for="lname">New Last Name</label>
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
        </div>
      </div>

      <div class="row p-1">
        <div class="col me-1">
          <div class="row">
            <label for="emailOld">Current Emai-Address</label>
            <input
              id="emailOld"
              type="email"
              v-model="form.valuesOld.email"
              disabled
            />
          </div>
        </div>
        <div class="col ms-1">
          <div class="row">
            <label for="email">New Emai-Address</label>
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
        </div>
      </div>

      <div class="row p-1">
        <div class="col me-1">
          <div class="row">
            <label for="usernameOld">Current Username</label>
            <input
              id="usernameOld"
              type="text"
              v-model="form.valuesOld.username"
              disabled
            />
          </div>
        </div>
        <div class="col me-1">
          <div class="row">
            <label for="username">New Username</label>
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
        </div>
      </div>

      <div class="row p-1">
        <label for="password">Your Current Password</label>
        <input
          id="password"
          type="password"
          v-model="form.values.currentPassword"
          v-on:blur="validate('password')"
        />
        <p class="text-danger" v-if="!!form.errors.password">
          {{ form.errors.password }}
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
          v-on:click.prevent="updateUser"
        >
          Update UserData
        </button>
      </div>
    </form>
  </div>
  <SuccessModal v-show="showModal" @close-modal="updateEvent"></SuccessModal>
</template>

<script>
import axios from "axios";
import * as yup from "yup";
import { object } from "yup";
const RegisterFormSchemaOnBlur = object().shape({
  fname: yup.string(),
  lname: yup.string(),
  email: yup.string().email(),
  username: yup.string(),
  currentPassword: yup.string().required(),
  password: yup.string(),
  passwordCheck: yup
    .string()
    .oneOf([yup.ref("password"), null], "Your passwords do not match."),
});

const RegisterFormSchema = object().shape({
  fname: yup.string(),
  lname: yup.string(),
  email: yup
    .string()
    .email()
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
  currentPassword: yup.string().required(),
  password: yup.string(),
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
      valuesOld: {
        fname: "",
        lname: "",
        email: "",
        username: "",
      },
      values: {
        id: "",
        fname: "",
        lname: "",
        email: "",
        username: "",
        currentPassword: "",
        password: "",
        passwordCheck: "",
      },
      errors: {
        fname: "",
        lname: "",
        email: "",
        username: "",
        currentPassword: "",
        password: "",
        passwordCheck: "",
      },
    },
    showModal: false,
  }),
  created() {
    this.getUser();
  },
  methods: {
    getUserIdOfJwt() {
      let jwtToken = sessionStorage.getItem("jwt");
      const jwtPayload = atob(jwtToken.split(".")[1]);
      console.log("jwtPayload: " + jwtPayload);
      const parsedPayload = JSON.parse(jwtPayload);
      return parsedPayload.user_id;
    },
    async getUser() {
      let jwtToken = sessionStorage.getItem("jwt");
      let userId = this.getUserIdOfJwt();
      try {
        axios
          .get(`http://localhost:8080/api/v1/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          })
          .then((response) => {
            this.form.valuesOld.fname = response.data.fname;
            this.form.valuesOld.lname = response.data.lname;
            this.form.valuesOld.username = response.data.username;
            this.form.valuesOld.email = response.data.email;
            this.form.values.id = response.data.id;
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    },
    updateEvent() {
      this.$router.push({
        name: "userprofil",
      });
    },
    async updateUser() {
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
          let jwtToken = sessionStorage.getItem("jwt");
          try {
            axios
              .post(
                "http://localhost:8080/api/v1/user/update",
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
