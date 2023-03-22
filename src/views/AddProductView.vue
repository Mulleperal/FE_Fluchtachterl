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

      <div class="mb-3" >
        <label class="form-label" >Image</label>
        <input type="file" class="form-control" ref="fileInput" @change="handleFileInputChange">
        <p class="warn" style="color: red" v-if="hasImg">Uploading a new Img will overwrite old one</p>

      </div>

      <button type="submit" class="btn btn-primary" v-if="!isEdit">Add Product</button>
      <button type="submit" class="btn btn-primary" v-if="isEdit">Update Product</button>
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
      isEdit: false,
      hasImg: false,
    };
  },
  components: {
    SuccessModal,
  },
  async created() {
    let isAdmin;
    if ("jwt" in sessionStorage) {
      isAdmin = sessionStorage.getItem("userrole") == "Admin";
    }
    if (!isAdmin) {
      this.$router.push({
        name: "about",
      });
    }
    if (this.$route.params.productId) {
      this.isEdit = true
      const data = await fetch(`http://localhost:8080/api/v1/product/get/${this.$route.params.productId}`)
          .then(resp => resp.json())
          .then(data => {
            this.category = data.category
                this.description = data.description
                this.name = data.name
                if (data.img) {
                  this.hasImg = true
                }
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
      let response = null

      if (this.isEdit) {
        response = await fetch(`http://localhost:8080/api/v1/product/update/${this.$route.params.productId}`, {
          method: 'PUT',
          body: formData,
          headers: {Authorization: `Bearer ${jwtToken}`,},
        });
      }
      else {
        response = await fetch(`http://localhost:8080/api/v1/product/create`, {
          method: 'POST',
          body: formData,
          headers: {Authorization: `Bearer ${jwtToken}`,},
        });
      }
      if (response) {
        this.showModal = true;
      } 
    }
  }
};
</script>
