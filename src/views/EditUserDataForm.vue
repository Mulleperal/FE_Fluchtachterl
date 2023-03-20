<template>
  <div class="container col-8 col-md-4 col-sm-6">
    <form>
      <div class="row p-1">
        <label for="input">Your {{ inputName }}</label>
        <input id="inputfield" type="text" v-model="form.values.inputfield" />
        <p class="text-danger" v-if="!!form.errors.inputfield">
          {{ form.errors.inputfield }}
        </p>
      </div>
      <div class="row p-2">
        <button
          class="btn btn-primary"
          type="submit"
          v-on:click.prevent="changeUserData"
        >
          Change {{ inputName }}
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

const FnameFormSchema = object().shape({
  inputfield: yup.string().required(),
});
const LnameFormSchema = object().shape({
  inputfield: yup.string().required(),
});
const UsernameFormSchema = object().shape({
  inputfield: yup
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
});
const EmailFormSchema = object().shape({
  inputfield: yup
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
        inputfield: "",
      },
      errors: {
        inputfield: "",
      },
    },
    showModal: false,
  }),
  props: {
    inputName: String,
  },
  created() {
    console.log("inputName is " + this.inputName);
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
    async changeUserData() {
      console.log("Start Validation of the Form");
      let jwtToken = sessionStorage.getItem("jwt");
      let userid = this.getUserIdOfJwt();
      let SchemaToUse;
      if (this.inputName == "username") {
        SchemaToUse = UsernameFormSchema;
      } else if (this.inputName == "fname") {
        SchemaToUse = FnameFormSchema;
      } else if (this.inputName == "lname") {
        SchemaToUse = LnameFormSchema;
      } else if (this.inputName == "email") {
        SchemaToUse = EmailFormSchema;
      }
      SchemaToUse.validate(this.form.values, {
        abortEarly: false,
      })
        .then(() => {
          console.log("Form is valid");
          this.form.errors = {
            input: "",
          };
          try {
            axios
              .get(
                `http://localhost:8080/api/v1/user/edit/${this.inputName}/${userid}/${this.form.values.inputfield}`,
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
  },
};
</script>

<style></style>
