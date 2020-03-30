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

        <ul>
          <li v-for="detail in details">{{ detail }}</li>
        </ul>

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

        <div class="cart">
          <p>Cart({{ cart }})</p>
        </div>

      </div>

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
      cart: 0
    }
  },
  methods: {
    addToCart() {
      this.cart += 1
    },
    removeFromCart() {
      if (this.cart > 0) {
        this.cart -= 1
      }
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
  }
})

var app = new Vue({
  el: '#app',
  data: {
    premium: true
  }
})
