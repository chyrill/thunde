<template>
  <v-container grid-list-md text-xs-center>
  <v-card style="padding-top:20px; padding-bottom:20px">
    <v-layout row wrap>
      <v-flex xs10 offset-xs1>
        <v-layout row wrap>
          <v-flex xs6>
        <v-text-field label="Search" hint="Product Name" v-model="ProductName" append-icon="search" @keyup="search" />
      </v-flex>
      <v-flex xs6>
        <v-select v-bind:items="categories" label="Category" hint="Product Category" v-model="Category" append-icon="filter_list" @input="search" />
      </v-flex>
      </v-layout>
      </v-flex>
    </v-layout>
    <v-container grid-list-md>
    <v-layout row wrap style="padding-left:10px;padding-right:10px">
      <v-flex xs3 offset-xs0 v-for="product in Products" v-if="!Loading">
        <v-card>
          <v-card-media :src="product.Images[0]" height="200px">
          </v-card-media>
          <v-card-title>
            <h2>{{product.Name}}</h2>
            </v-card-title>
            <v-card-text style="text-align:justify">

            <div><b>Description:</b><p v-html="product.Description"></p></div>
              <div><b>Features:</b> <p v-html="product.Features"></p></div>

      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn icon color="success" @click="openAddDialog(product._id)"><v-icon>add_shopping_cart</v-icon></v-btn><v-btn icon color="warning" @click="openViewDialog(product._id)"><v-icon>visibility</v-icon></v-btn>
      </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs10 offset-xs1>
      <v-progress-circular indeterminate v-bind:size="70" v-bind:width="7" color="purple" v-if="Loading"></v-progress-circular>
    </v-flex>
    </v-layout>
  </v-container>
  </v-card>
                 <v-dialog v-model="viewItemDailog" max-width="800px">
              <v-toolbar dark color="primary">
                 <v-toolbar-title>Product Information</v-toolbar-title>
              </v-toolbar>
                   <v-card>
                     <v-card-text>
                      <ProductView :id="viewItemId"/>
                     </v-card-text>
                   <v-card-actions>
                     <v-spacer></v-spacer>
                     <v-btn color="primary" @click="viewItemDailog=!viewItemDailog">Close</v-btn>
                     </v-card-actions>
                   </v-card>
                 </v-dialog>
                 <v-dialog v-model="addItemDialog" max-width="400px">
              <v-toolbar dark color="primary">
                 <v-toolbar-title>Quantity</v-toolbar-title>
              </v-toolbar>
                   <v-card>
                     <v-card-text>
                      <v-text-field type="number" label="Quantity" v-model="Quantity"/>
                     </v-card-text>
                   <v-card-actions>
                     <v-spacer></v-spacer>
                      <v-btn color="success" @click="addToShoppingCart">Add</v-btn>
                     <v-btn color="primary" @click="addItemDialog=!addItemDialog">Close</v-btn>
                     </v-card-actions>
                   </v-card>
                 </v-dialog>
            <v-snackbar :timeout="snackbar.timeout" :color="snackbar.color" :top="snackbar.top" :multi-line="snackbar.multi" :vertical="snackbar.vertical" v-model="Snackbar"> {{Errors}}<v-spacer></v-spacer><v-icon>{{snackbar.actions}}</v-icon></v-snackbar>
</v-container>
</template>

<script>
import axios from 'axios'
import ProductView from '../../ProductsManagement/Forms/ProductView'

export default {
  data () {
    return {
      viewItemDailog: false,
      viewItemId: '',
      addItemId: '',
      Quantity: '',
      addItemDialog: false,
      categories: [],
      Products: [],
      ProductName: '',
      Category: '',
      Snackbar: false,
      snackbar: {
        timeout: 6000,
        top: true,
        multi: false,
        vertical: false,
        actions: '',
        color: ''
      },
      Loading: false,
      Errors: '',
      viewItemId: '',
      viewItemDailog: false
    }
  },
  mounted () {
      this.Loading = true
    axios({
      method: 'get',
      url: 'http://localhost:3001/api/v1/products/',
      params:{
        skip: this.Skip,
        limit: 20,
        Filters: 'Name:/' + this.ProductName + '/,' + 'Category:/' + this.Category + '/',
        Context: localStorage.getItem('Context')
      }
    }).
       then(response => {
         for (let i in response.data.items){
           response.data.items[i].Description = response.data.items[i].Description.replace(/\n/g, "<br />")
           if (response.data.items[i].Description.length >150) {
            response.data.items[i].Description = response.data.items[i].Description.substring(0, 147) + '...'
           }
           response.data.items[i].Features = response.data.items[i].Features.replace(/\n/g, "<br />")
           if (response.data.items[i].Features.length >150) {
            response.data.items[i].Features = response.data.items[i].Features.substring(0, 147) + '...'
           }
         }
         this.Products = response.data.items
         this.Loading = false
       })
       .catch(err => {
         console.log(err.response.data)
         this.Products = err.response.data.items
         this.Loading = false
       })
    axios({
      method: 'get',
      url: 'http://localhost:3001/api/v1/category/',
      params: {
        Context: localStorage.getItem('Context')
      }
    }).
      then(response =>{
        var categoryItem = response.data.items
        this.categories.push('')
        for (let item in categoryItem) {
          this.categories.push(categoryItem[item].Name)
        }

      })
  },
  methods: {
    getProduct () {
     axios({
      method: 'get',
      url: 'http://localhost:3001/api/v1/products/',
      params:{
        skip: this.Skip,
        limit: 20,
        Filters: 'Name:/' + this.ProductName + '/,' + 'Category:/' + this.Category + '/',
        Context: localStorage.getItem('Context')
      }
    }).
       then(response => {
         for (let i in response.data.items){
           response.data.items[i].Description = response.data.items[i].Description.replace(/\n/g, "<br />")
           if (response.data.items[i].Description.length >150) {
            response.data.items[i].Description = response.data.items[i].Description.substring(0, 147) + '...'
           }
           response.data.items[i].Features = response.data.items[i].Features.replace(/\n/g, "<br />")
           if (response.data.items[i].Features.length >150) {
            response.data.items[i].Features = response.data.items[i].Features.substring(0, 147) + '...'
           }
         }
         this.Products = response.data.items
         this.Loading = false
       })
       .catch(err => {
         console.log(err.response.data)
         this.Products = err.response.data.items
         this.Loading = false
       })
    },
    search () {
      this.getProduct()
    },
    openAddDialog (value) {
      this.addItemDialog = !this.addItemDialog
      this.addItemId = value
    },
    addToShoppingCart () {
      axios({
        method: 'get',
        url: 'http://localhost:3001/api/v1/products/' + this.addItemId,
        params: {
          Context: localStorage.getItem('Context')
        }
      })
        .then(response =>{
          var itemModel = response.data.model
          itemModel['Quantity'] = this.Quantity
          this.Quantity = ''
          this.$store.dispatch('addItemToCart',itemModel)
          this.addItemDialog = !this.addItemDialog
          this.snackbar.color = 'green'
          this.Errors = 'Successfully added to cart'
          this.snackbar.actions = 'check'
          this.Snackbar = true
        })
    },
    openViewDialog (value) {
      this.viewItemDailog = true
      this.viewItemId = value
    }
  },
  components: {
    ProductView
  }
}
</script>
