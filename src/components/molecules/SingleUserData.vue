<template>
  <div class="input-group mb-3">
    <span class="input-group-text" id="basic-addon3"> {{ inputData }}</span>
    <input
      type="text"
      class="form-control"
      id="input"
      aria-describedby="basic-addon3"
      :value="inputValue"
      disabled
    />
    <button
      class="btn btn-outline-secondary"
      type="button"
      id="button-addon2"
      v-on:click.prevent="redirectToEditForm(inputData)"
    >
      Edit
    </button>
  </div>
</template>

<script>
export default {
  name: "SingleUserData",
  data: () => ({}),
  props: {
    inputData: String,
    inputValue: String,
  },
  methods: {
    redirectToEditForm() {
      this.$router.push({
        name: "useredit",
        params: { inputName: this.inputData },
      });
    },
  },
};
</script>
