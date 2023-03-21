<template>
  <div class="container" v-if="hasAdminRole">
    <div class="row">
      <h2 class="my-3 border border-secondary border-2 rounded py-3">
        User Control
      </h2>
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Userame</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Locked?</th>
            <th scope="col">Role</th>
            <th scope="col" colspan="3">Take Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, i) in userData" :key="i">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.fname + " " + user.lname }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.locked }}</td>
            <td>{{ user.userPermission }}</td>
            <td>
              <button
                v-if="user.locked"
                v-on:click.prevent="unlockUser(user.username)"
                class="btn btn-secondary ms-2"
              >
                BLOCK
              </button>
            </td>
            <td>
              <button
                v-if="!user.locked"
                v-on:click.prevent="lockUser(user.username)"
                class="btn btn-warning ms-2"
              >
                UNBLOCK
              </button>
            </td>
            <td>
              <button
                v-on:click.prevent="deleteUser(user.username)"
                class="btn btn-danger ms-2"
              >
                DELETE
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserControlView",
  data: () => ({
    userData: Object,
    hasAdminRole: Boolean,
  }),
  methods: {
    changeUserStatus(newStatus, username) {
      this.userData.find((item) => item.username == username).locked =
        newStatus;
    },
    removeUser(username) {
      let indexToRemove = this.userData.findIndex(
        (obj) => obj.username == username
      );
      this.userData.splice(indexToRemove, 1);
    },
    async lockUser(username) {
      let jwtToken = sessionStorage.getItem("jwt");
      try {
        axios
          .get(`http://localhost:8080/api/v1/user/blockUser/${username}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          })
          .then(() => {
            this.changeUserStatus(true, username);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    },
    async unlockUser(username) {
      let jwtToken = sessionStorage.getItem("jwt");
      try {
        axios
          .get(`http://localhost:8080/api/v1/user/unblockUser/${username}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          })
          .then(() => {
            this.changeUserStatus(false, username);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    },
    async deleteUser(username) {
      let jwtToken = sessionStorage.getItem("jwt");
      try {
        axios
          .get(`http://localhost:8080/api/v1/user/deleteUser/${username}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          })
          .then(() => {
            this.removeUser(username);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    },
    async getAllUsers() {
      let jwtToken = sessionStorage.getItem("jwt");
      try {
        axios
          .get(`http://localhost:8080/api/v1/user/getAll`, {
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
    if ("jwt" in sessionStorage) {
      this.hasAdminRole = sessionStorage.getItem("userrole") == "Admin";
    }
    if (!this.hasAdminRole) {
      this.$router.push({
        name: "about",
      });
    }
    this.getAllUsers();
  },
  components: {},
};
</script>
<style></style>
