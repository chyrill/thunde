<template>
  <v-container grid-list-md>
   <v-card>
        <v-list two-line>
          <template v-for = "item in ShoppingCart.Items">
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <img :src="item.Images[0]"/>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="item.Name"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.SKU"></v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                  {{item.Quantity}} items
                  <v-btn icon flat @click="removeShoppingCart(item._id)"><v-icon>remove</v-icon></v-btn>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider></v-divider>
          </template>
        </v-list>
        <v-card-actions>
          <v-spacer></v-spacer>
           <v-btn flat color="primary" v-if="ShoppingCart.Items.length>0" @click="requestQuotation">Request a Quote</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
</template>

<script>

export default {
  data () {
    return {
      IsAuthenticated: localStorage.getItem('IsAuthenticated')
    }
  },
  computed:{
    ShoppingCart () {
      return this.$store.getters.getShoppingCart
    },
    User () {
      return this.$store.getters.getUser
    }
  },
  methods: {
    removeShoppingCart (value) {
      this.$store.dispatch('removeItemInCart',value)
    },
    requestQuotation () {
      this.$store.dispatch('requestForQoutation')
    }
  }
}
</script>
