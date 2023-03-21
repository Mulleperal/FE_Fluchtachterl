<template>
  <div class="container">
    <form @submit.prevent="handleSubmit" class="p-4 border rounded">

      <div class="mb-3">
        <label class="form-label">Name</label>
        <input type="text" class="form-control" v-model="name">
      </div>

      <div class="mb-3">
        <label class="form-label">Category</label>
        <input type="text" class="form-control" v-model="category">
      </div>
      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea class="form-control" v-model="description"></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">Image</label>
        <input type="file" class="form-control" ref="fileInput" @change="handleFileInputChange">
      </div>
      <button type="submit" class="btn btn-primary">Add Product</button>
    </form>
  </div>
  <SuccessModal
    v-show="showModal"
    @close-modal="redirectBackToProducts"
  >
  </SuccessModal>
</template>


<script>
import SuccessModal from "@/components/organisms/SuccessModal.vue";

export default {
  data() {
    return {
      category: '',
      description: '',
      name: '',
      image: null,
      showModal: false,
    };
  },
  components: {
    SuccessModal,
  },
  created() {
    let isAdmin;
    if ("jwt" in sessionStorage) {
      isAdmin = sessionStorage.getItem("userrole") == "Admin";
    }
    if (!isAdmin) {
      this.$router.push({
        name: "about",
      });
    }
  },
  methods: {
    redirectBackToProducts() {
      this.$router.push({
        name: "products",
      });
    },
    handleFileInputChange(event) {
      this.image = event.target.files[0];
    },
    async handleSubmit() {
      let jwtToken = sessionStorage.getItem("jwt");
      const formData = new FormData();
      formData.append('category', this.category);
      formData.append('description', this.description);
      formData.append('name', this.name);
      if (this.image) {
        formData.append('file', this.image);
      }
      const response = await fetch(`http://localhost:8080/api/v1/product/create`, {
        method: 'POST',
        body: formData,
        headers: {Authorization: `Bearer ${jwtToken}`,},
      });
      if (response) {
        this.showModal = true;
      } 
    }
  }
};
</script>
