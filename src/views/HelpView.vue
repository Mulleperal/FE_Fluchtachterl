<template>
  <div class="container">
    <div class="mt-3">
      <h1>Help Page</h1>
      <!--<div class="mt-3">
        <form class="d-flex" role="search">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button class="btn btn-outline-success" @click.prevent>Search</button>
        </form>
      </div>-->
      <div class="mt-4">
        <div class="accordion" id="accordionExample">
          <template v-for="item in data" :key="item.id">
            <div class="accordion-item">
              <h2 class="accordion-header" :id="'heading' + item.id">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  v-bind:data-bs-target="'#collapse' + item.id"
                  aria-expanded="true"
                  v-bind:aria-controls="'collapse' + item.id"
                >
                  {{ item.question }}
                </button>
              </h2>
              <div
                :id="'collapse' + item.id"
                class="accordion-collapse collapse"
                v-bind:aria-labelledby="'heading' + item.id"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body">
                  {{ item.answer }}
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "EditUserDataForm",
  components: {
  },
  data: () => ({
    data: [{
  id: 1,
  question: "How to protect yourself from fraud?",
  answer: "On the one hand, it is advisable to read the seller's reviews before buying. On the other hand, the free, so-called buyer protection helps against fraud. If the purchased item does not match the description or does not arrive at the buyer, he receives the entire purchase price, including shipping costs, back."
},
{
  id: 2,
  question: "How can I contact a seller?",
  answer: "After buying an item, you can contact any seller using the \Contact seller\ button. Before the purchase, not all sellers allow questions. If questions are accepted, the \Contact seller\ button can also be found under the seller's details. For sellers who share their phone number, it can also be found under \Contact seller\."
},
{
  id: 3,
  question: "Why has my account been blocked?",
  answer: "Reasons for suspending an account may include: Non-payment of fees or refunds to buyers, suspicion of unauthorized access to the account, suspected fraud, rule violations."
}]
  }),
}


</script>






<style>
.about {
  hyphens: auto;
  text-align: justify;
}
</style>
