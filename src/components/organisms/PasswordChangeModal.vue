<template>
  <div class="modal-overlay" @click="$emit('close-modal')">
    <div class="modal-white" @click.stop>
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
            v-on:click.prevent="registerUser"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import * as yup from "yup";
import { object } from "yup";
const RegisterFormSchema = object().shape({
  currentPassword: yup.string().required(),
  password: yup.string().min(8).required(),
  passwordCheck: yup
    .string()
    .oneOf([yup.ref("password"), null], "Your passwords do not match."),
});

export default {
  name: "PasswordChangeModal",
  components: {},
  data: () => ({
    form: {
      values: {
        currentPassword: "",
        password: "",
        passwordCheck: "",
      },
      errors: {
        currentPassword: "",
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
    async changePassword() {
      console.log("Start Validation of the Form");
      RegisterFormSchema.validate(this.form.values, {
        abortEarly: false,
      })
        .then(() => {
          console.log("Form is valid");
          this.form.errors = {
            currentPassword: "",
            password: "",
            passwordCheck: "",
          };
          try {
            axios
              .post(
                "http://localhost:8080/api/v1/user/register",
                this.form.values
              )
              .then(() => {
                // Hier dann den Response Verarbeiten -> z.B. zu ein MODAL mit einer Erfolgsnachricht.
                // Backlink einblenden bei Success
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

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: #000000da;
}

.modal-white {
  text-align: center;
  background-color: white;
  height: 500px;
  width: 700px;
  margin-top: 10%;
  padding: 60px 0;
  border-radius: 20px;
}

h6 {
  font-weight: 500;
  font-size: 28px;
  margin: 20px 0;
}

p {
  font-size: 16px;
  margin: 20px 0;
}
</style>
