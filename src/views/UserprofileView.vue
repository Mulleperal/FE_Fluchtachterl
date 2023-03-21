<template>
  <div class="container">
    <div class="row">
      <h2 class="my-3 border border-secondary border-2 rounded py-3">
        My User Data Overview
      </h2>
      <SingleUserData
        v-bind:inputData="`username`"
        v-bind:inputValue="userData.username"
      />
      <SingleUserData
        v-bind:inputData="`fname`"
        v-bind:inputValue="userData.fname"
      />
      <SingleUserData
        v-bind:inputData="`lname`"
        v-bind:inputValue="userData.lname"
      />
      <SingleUserData
        v-bind:inputData="`email`"
        v-bind:inputValue="userData.email"
      />
      <button
        class="btn btn-primary"
        type="submit"
        v-on:click.prevent="redirectToPasswordForm"
      >
        Change Password
      </button>
    </div>
  </div>
</template>

<script>
import SingleUserData from "@/components/molecules/SingleUserData.vue";
import axios from "axios";

export default {
  name: "UserProfileView",
  data: () => ({
    userData: Object,
    showModal: false,
  }),
  methods: {
    redirectToPasswordForm() {
      this.$router.push({
        name: "passwordedit",
      });
    },
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
            this.userData = response.data;
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.getUser();
  },
  components: { SingleUserData },
};
</script>
<style></style>
