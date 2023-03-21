<template>
  <div>
    <nav class="navbar navbar-expand-lg bg-light">
      <div class="container-fluid">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo03"
          aria-controls="navbarTogglerDemo03"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <a class="navbar-brand">Fluchtachterl</a>
        <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <NavbarItem to="/usercontrol" v-if="!!this.isAdmin"
              >User Control</NavbarItem
            >
            <NavbarItem to="/auctions">Auctions</NavbarItem>
            <NavbarItem to="/products">Products</NavbarItem>
            <NavbarItem to="/mybids" v-if="!!this.isLogedIn"
              >My Bids</NavbarItem
            >
            <NavbarItem to="/help">Help</NavbarItem>
            <NavbarItem to="/imprint">Imprint</NavbarItem>
          </ul>
          <div class="d-flex">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <NavbarItem to="/login" v-if="!this.isLogedIn">Login</NavbarItem>
              <NavbarItem to="/register" v-if="!this.isLogedIn">
                Register
              </NavbarItem>
              <NavbarItem
                to="/"
                v-if="!!this.isLogedIn"
                @click="$emit('logoutEvent')"
                >Logout</NavbarItem
              >
              <NavbarItem to="/userprofil" v-if="!!this.isLogedIn">
                Userprofile
              </NavbarItem>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import NavbarItem from "@/components/atoms/bt5NavbarItems.vue";

export default {
  name: "bt5Navbar",
  props: {
    isLogedIn: Boolean,
    isAdmin: Boolean,
  },
  components: {
    NavbarItem,
  },
};
</script>

<style></style>
