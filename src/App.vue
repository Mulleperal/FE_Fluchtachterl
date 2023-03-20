<template>
  <nav>
    <Bt5Navbar
      v-bind:isLogedIn="logedIn"
      v-bind:isAdmin="hasAdminRole"
      @logout-event="logout"
    ></Bt5Navbar>
  </nav>
  <router-view @login-event="login" @register-event="register" />
</template>

<script>
// @ is an alias to /src
import Bt5Navbar from "./components/organisms/bt5Navbar.vue";

export default {
  data: () => ({
    logedIn: Boolean,
    hasAdminRole: Boolean,
  }),
  created() {
    if ("jwt" in sessionStorage) {
      this.logedIn = true;
      this.hasAdminRole = sessionStorage.getItem("userrole") == "Admin";
      console.log("There is a Session! " + this.logedIn);
    } else {
      this.logedIn = false;
      this.hasAdminRole = false;
      console.log("There is NO Session! " + this.logedIn);
    }
  },
  components: {
    Bt5Navbar,
  },
  methods: {
    checkLoginStatus() {
      if ("jwt" in sessionStorage) {
        return true;
      } else {
        return false;
      }
    },
    logout() {
      console.log("Logout-Event triggerd.");
      sessionStorage.clear();
      this.logedIn = false;
      this.hasAdminRole = false;
      this.$router.push({ name: "home" });
    },
    login() {
      this.logedIn = true;
      this.hasAdminRole = sessionStorage.getItem("userrole") == "Admin";
      this.$router.push({ name: "auctions" });
    },
    register() {
      this.logedIn = true;
      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
