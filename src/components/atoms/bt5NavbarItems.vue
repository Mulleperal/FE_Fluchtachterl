<template>
  <li class="nav-item" :class="{ active: isActive }">
    <router-link :to="to" class="nav-link">
      <slot />
    </router-link>
  </li>
</template>

<script>
import { computed } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "bt5NavbarItem",
  props: {
    to: { type: String },
  },
  setup(props) {
    const route = useRoute();
    const isActive = computed(() => route.path === props.to);
    return { isActive };
  },
};
</script>
