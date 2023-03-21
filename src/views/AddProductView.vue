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
</template>
<script>
export default {
  data() {
    return {
      category: '',
      description: '',
      name: '',
      image: null
    };
  },
  methods: {
    handleFileInputChange(event) {
      this.image = event.target.files[0];
    },
    async handleSubmit() {
      const formData = new FormData();
      formData.append('category', this.category);
      formData.append('description', this.description);
      formData.append('name', this.name);
      if (this.image) {
        formData.append('file', this.image);
      }
      const response = await fetch(`http://localhost:8080/api/v1/product/create`, {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        // do something with the response, such as navigate to a success page
      } else {
        // handle the error
      }
    }
  }
};
</script>
