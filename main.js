var app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: []
  },
  methods: {
    addToCart(id) {
      this.cart.push(id)
    },
    removeItem(id) {
      if (this.cart.length > 0) {
        for (var i = this.cart.length - 1; i>=0; i--) {
          if (this.cart[i] === id) {
            this.cart.splice(i, 1)
          }
        }
      }
    }
  }
})
