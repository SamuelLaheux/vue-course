var eventBus = new Vue()

Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `
    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>
  `
})

Vue.component('product-review', {
  template: `
    <div>
      <form class="review-form" @submit.prevent="onSubmit">

        <p v-if="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
        </p>

        <p>
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="name">
        </p>

        <p>
          <label for="review">Review:</label>
          <textarea id="review" v-model="review"></textarea>
        </p>

        <p>
          <label for="rating">Rating:</label>
          <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
          </select>
        </p>

        <p>Would you recommend this product ?</p>
        <input type="radio" value="yes" v-model="recommend">
        <label for="yes">Yes</label><br>
        <input type="radio" value="no" v-model="recommend">
        <label for="no">No</label><br>

        <p>
          <input type="submit" value="Submit">
        </p>

      </form>

    </div>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: [],
      recommend: null
    }
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating && this.recommend) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend
        }
        eventBus.$emit('review-submitted', productReview)
        this.name = null
        this.review = null
        this.rating = null
        this.recommend = null
      }
      else {
        if(!this.name) this.errors.push("Name required.")
        if(!this.review) this.errors.push("Review required.")
        if(!this.rating) this.errors.push("Rating required.")
        if(!this.recommend) this.errors.push("Recommend required.")
      }
    }
  }
})

Vue.component('product-tabs', {
  props: {
    reviews: {
      type: Array,
      required: false
    }
  },
  template: `
    <div>
      <span class="tab"
            v-bind:class="{ activeTab: selectedTab === tab }"
            v-for="(tab, index) in tabs"
            :key="index"
            v-on:click="selectedTab = tab">
            {{ tab }}
      </span>


      <div v-show="selectedTab === 'Reviews'">
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul v-else>
          <li v-for="(review, index) in reviews" :key="index">
            <p>{{ review.name }}</p>
            <p>Rating: {{ review.rating }}</p>
            <p>{{ review.review }}</p>
          </li>
        </ul>
      </div>

      <div v-show="selectedTab === 'Make a Review'">
        <product-review></product-review>
      </div>

    </div>
  `,
  data() {
    return {
      tabs: ['Reviews', 'Make a Review'],
      selectedTab: 'Reviews'
    }
  }
})

Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
    <div class="product">
      <div class="product-image">
        <img v-bind:src="image" />
      </div>

      <div class="product-info">
        <h1>{{ title }}</h1>
        <a :href="link" target="_blank">More products like this</a>
        <p v-if="inventory > 100">In Stock</p>
        <p v-else-if="inventory < 10 && inventory > 0 ">Almost sold out</p>
        <p v-else
           v-bind:class="{ outOfStock: inventory <= 0 }">Out of Stock</p>
        <span v-if="onSale">On Sale!</span>

        <p> Shipping: {{ shipping }} (User is premium: {{ premium }})</p>

        <product-details v-bind:details="details"></product-details>

        <div v-for="(variant, index) in variants"
             v-bind:key="variant.variantId"
             class="color-box"
             v-bind:style="{ backgroundColor: variant.variantColor}"
             v-on:mouseover="updateProduct(index)">
        </div>

        <button type="button"
                name="add_to_cart"
                v-on:click="addToCart"
                v-bind:disabled="inventory <= 0"
                v-bind:class="{ disabledButton: inventory <= 0 }">Add to Cart</button>
        <button type="button" name="remove_from_cart" @click="removeFromCart">Remove From Cart</button>

      </div>

      <product-tabs :reviews="reviews"></product-tabs>

    </div>
  `,
  data() {
    return {
      brand: 'Vue Mastery',
      product: 'Socks',
      selectedVariant: 0,
      link: 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks',
      onSale: false,
      details: ['80% cotton', '20% polyester', 'Gender-neutral'],
      variants: [
        {
          variantId: 2234,
          variantColor: "green",
          variantImage: './assets/vmSocks-green-onWhite.jpg',
          variantQuantity: 8
        },
        {
          variantId: 2235,
          variantColor: "blue",
          variantImage: './assets/vmSocks-blue-onWhite.jpg',
          variantQuantity: 0
        }
      ],
      reviews: []
    }
  },
  methods: {
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId)
    },
    removeFromCart() {
      this.$emit("remove-from-cart", this.variants[this.selectedVariant].variantId)
    },
    updateProduct(index) {
      this.selectedVariant = index
    }
  },
  computed: {
    title() {
      return this.brand + ' ' + this.product + (this.onSale ? ' on Sale!' : ' (not on Sale)')
    },
    image() {
      return this.variants[this.selectedVariant].variantImage
    },
    inventory() {
      return this.variants[this.selectedVariant].variantQuantity
    },
    shipping() {
      if (this.premium) {
        return "Free"
      }
      return "2.99$"
    }
  },
  mounted() {
    eventBus.$on('review-submitted', productReview => {
      this.reviews.push(productReview)
    })
  }
})
