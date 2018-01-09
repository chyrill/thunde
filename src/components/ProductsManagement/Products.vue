<template>
  <v-container grid-list-md text-xs-center>
  <v-card style="padding-top:20px; padding-bottom:20px">
    <v-layout row wrap>
      <v-flex xs10 offset-xs1>
        <v-text-field label="Search" hint="Product Name" v-model="ProductName" append-icon="search" @keyup="search" />
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
        <v-btn icon color="error" @click="openDeleteDialog(product._id)"><v-icon>delete</v-icon></v-btn><v-btn icon color="warning" @click="openEditDialog(product._id)"><v-icon>edit</v-icon></v-btn><v-btn icon color="success" @click="openViewDialog(product._id)"><v-icon>visibility</v-icon></v-btn>
      </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs10 offset-xs1>
      <v-progress-circular indeterminate v-bind:size="70" v-bind:width="7" color="purple" v-if="Loading"></v-progress-circular>
    </v-flex>
    </v-layout>
    <v-layout>
      <v-spacer></v-spacer>
      <v-btn
              absolute
              dark
              fab
              bottom
              right
              color="accent"
              @click.stop = "dialog2 = !dialog2"
            >
              <v-icon>add</v-icon>
            </v-btn>
    </v-layout>
  </v-container>
  </v-card>
  <v-dialog v-model="dialog2" max-width="800px">
    <v-toolbar dark color="primary">
       <v-toolbar-title>Product Information</v-toolbar-title>
    </v-toolbar>
         <v-card>
          <ProductForm @isValid="ifValidProductInfo" @dataEmit="emittedData" :clearData="clearData" :id="editItemId"/>
         <v-card-actions>
           <v-spacer></v-spacer>
           <v-btn color="error" @click.stop="dialog2=false">Close</v-btn>
           <v-btn color="primary" :disabled="ValidProduct" @click="Submit">Submit</v-btn>
            <v-btn color="warning" @click="addCategory">Add Category</v-btn>
           </v-card-actions>
         </v-card>
       </v-dialog>
       <v-dialog v-model="categoryDialog" max-width="400px">
         <v-toolbar dark color="primary">
            <v-toolbar-title>Add Category</v-toolbar-title>
         </v-toolbar>
              <v-card>
                <v-card-text>
                  <v-container grid-list-xs text-xs-center>
                    <v-form>
                    <v-layout>
                      <v-flex>
                        <v-text-field label="Category" v-model="CategoryName" :error-messages="categoryErrors" @blur="$v.CategoryName.$touch()" @input="$v.CategoryName.$touch()"/>
                      </v-flex>
                    </v-layout>
                  </v-form>
                  </v-container>
                </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" @click.stop="categoryDialog=false">Close</v-btn>
                <v-btn color="primary" :disabled="$v.$invalid" @click="SubmitCategory">Submit</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="deleteItemDialog" max-width="400px">
              <v-toolbar dark color="error">
                 <v-toolbar-title>Delete Product</v-toolbar-title>
              </v-toolbar>
                   <v-card>
                     <v-card-text>
                      <p>Are you sure you want to delete this item?</p>
                     </v-card-text>
                   <v-card-actions>
                     <v-spacer></v-spacer>
                     <v-btn color="primary" @click="deleteItemDialog=!deleteItemDialog">Close</v-btn>
                     <v-btn color="error" @click="deleteItem">Ok</v-btn>
                     </v-card-actions>
                   </v-card>
                 </v-dialog>
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
            <v-snackbar :timeout="snackbar.timeout" :color="snackbar.color" :top="snackbar.top" :multi-line="snackbar.multi" :vertical="snackbar.vertical" v-model="Snackbar"> {{Errors}}<v-spacer></v-spacer><v-icon>{{snackbar.actions}}</v-icon></v-snackbar>
</v-container>
</template>

<script>
import axios from 'axios';
import ProductForm from './Forms/ProductForm'
import ProductView from './Forms/ProductView'
import {
  validationMixin
} from 'vuelidate'

import {
  required,
  minLength
} from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  validations: {
    CategoryName: {
      required,
      minLength: minLength(3)
    }
  },
  name: 'Products',
  data () {
    return {
      viewItemDailog: false,
      viewItemId: '',
      editItemId: '',
      deleteItemId: '',
      deleteItemDialog: false,
      clearData: true,
      ValidProduct: true,
      ProductName: '',
      Products: [],
      Skip: 0,
      Loading: false,
      dialog2: false,
      categoryDialog: false,
      CategoryName: '',
      Snackbar: false,
      snackbar :{
        timeout: 6000,
        top: true,
        multi: false,
        vertical: false,
        color: 'red',
        actions: ''
      },
      Errors: '',
      Data: {}
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
        Filters: 'Name:/' + this.ProductName + '/',
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
  methods: {
    search () {
      this.Loading = true
      axios({
        method: 'get',
        url: 'http://localhost:3001/api/v1/products/',
        params:{
          skip: this.Skip,
          limit: 20,
          Filters: 'Name:/' + this.ProductName + '/',
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
    addCategory () {
      this.categoryDialog = !this.categoryDialog
    },
    SubmitCategory () {
      axios({
        method: 'post',
        url: 'http://localhost:3001/api/v1/category',
        data: {Name: this.CategoryName},
        headers: {
            'Authorization' : 'Bearer '+ this.$store.getters.getAuthCode
        }
      })
        .then(response => {
          this.categoryDialog = false
          this.Errors = response.data.message,
          this.snackbar.color = 'success',
          this.snackbar.actions = 'check',
          this.Snackbar = true,
          this.CategoryName = ''
        })
        .catch(err => {
          this.Errors = err.response.data.message,
          this.snackbar.color = 'error',
          this.snackbar.actions = 'close',
          this.Snackbar = true
        })
    },
    ifValidProductInfo (value) {
      if (value) {
        this.ValidProduct = false
      }
      else {
        this.ValidProduct = true
      }
    },
    emittedData (value) {
      this.Data = value
    },
    Submit () {
      console.log(this.Data)
      if (this.Data._id != null || this.Data._id != undefined) {
         axios({
        method: 'put',
        url: 'http://localhost:3001/api/v1/products/',
        data: this.Data,
        headers: {
          'Authorization' : 'Bearer ' + this.$store.getters.getAuthCode
        }
      })
        .then(response =>{
          this.dialog2 = false
          this.clearData = !this.clearData
          this.Errors = response.data.message,
          this.snackbar.color = 'success',
          this.snackbar.actions = 'check',
          this.Snackbar = true
          this.refresh()
        })
        .catch(err =>{
          this.Errors = err.response.data.message,
          this.snackbar.color = 'error',
          this.snackbar.actions = 'close',
          this.Snackbar = true
          this.refresh()
        })
      }
      else {
        axios({
        method: 'post',
        url: 'http://localhost:3001/api/v1/products/',
        data: this.Data,
        headers: {
          'Authorization' : 'Bearer ' + this.$store.getters.getAuthCode
        }
      })
        .then(response =>{
          this.dialog2 = false
          this.clearData = !this.clearData
          this.Errors = response.data.message,
          this.snackbar.color = 'success',
          this.snackbar.actions = 'check',
          this.Snackbar = true
          axios({
            method: 'get',
            url: 'http://localhost:3001/api/v1/products/',
            params:{
              skip: this.Skip,
              limit: 20,
              Filters: 'Name:/' + this.ProductName + '/',
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
        })
        .catch(err =>{
          this.Errors = err.response.data.message,
          this.snackbar.color = 'error',
          this.snackbar.actions = 'close',
          this.Snackbar = true
          axios({
            method: 'get',
            url: 'http://localhost:3001/api/v1/products/',
            params:{
              skip: this.Skip,
              limit: 20,
              Filters: 'Name:/' + this.ProductName + '/',
              Context: localStorage.getItem('Context')
            }
          }).
             then(response => {
               this.Products = response.data.items
               this.Loading = false
             })
             .catch(err => {
               console.log(err.response.data)
               this.Products = err.response.data.items
               this.Loading = false
             })
        })
      }
    },
    openDeleteDialog (value) {
      this.deleteItemDialog = true
      this.deleteItemId = value
    },
    deleteItem () {
      axios({
        method: 'delete',
        url: 'http://localhost:3001/api/v1/products/'+this.deleteItemId,
        headers: {
          'Authorization' : 'Bearer '+ this.$store.getters.getAuthCode
        }
      }).
         then(response => {
           this.deleteItemId = ''
           this.Errors = response.data.message
           this.snackbar.color = 'success'
           this.snackbar.actions = 'check'
           this.Snackbar = true
           this.deleteItemDialog = false
           this.refresh()
         })
         .catch(err => {
           this.Errors = err.response.data.message
           this.snackbar.color = 'error'
           this.snackbar.actions = 'close'
           this.Snackbar = true
           this.deleteItemDialog = false
         })
    },
    refresh () {
      axios({
        method: 'get',
        url: 'http://localhost:3001/api/v1/products/',
        params:{
          skip: this.Skip,
          limit: 20,
          Filters: 'Name:/' + this.ProductName + '/',
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
           this.Products = err.response.data.items
           this.Loading = false
         })
    },
    openViewDialog (value) {
      this.viewItemId = value
      this.viewItemDailog = !this.viewItemDailog
    },
    openEditDialog (value) {
      this.editItemId = value
      this.dialog2 = !this.dialog2
    }
  },
  computed: {
    categoryErrors () {
      const errors = []
      if (!this.$v.CategoryName.$dirty) return errors
      !this.$v.CategoryName.required && errors.push('Category is required')
      !this.$v.CategoryName.minLength && errors.push('Minimum length of 3')
      return errors
    }
  },
  components: {
    ProductForm,
    ProductView
  }
}
</script>
