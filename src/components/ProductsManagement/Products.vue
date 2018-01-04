<template>
  <v-container grid-list-md text-xs-center>
  <v-card style="padding-top:20px; padding-bottom:20px">
    <v-layout row wrap>
      <v-flex xs10 offset-xs1>
        <v-text-field label="Search" hint="Product Name" v-model="ProductName" append-icon="search" @keyup="search" />
      </v-flex>
    </v-layout>
    <v-layout row wrap text-xs-center style="padding-left:10px;padding-right:10px">
      <v-flex xs3 offset-xs0 v-for="product in Products" v-if="!Loading">
        <v-card>
          <v-card-title>
            <h2>{{product.Name}}</h2>
            <div><p>Description: {{product.Description}}</p></div>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs10 offset-xs1>
      <v-progress-circular indeterminate v-bind:size="70" v-bind:width="7" color="purple" v-if="Loading"></v-progress-circular>
    </v-flex>
    </v-layout>
  </v-card>
</v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Products',
  data() {
    return {
      ProductName: '',
      Products: [],
      Skip: 0,
      Loading: false
    }
  },
  mounted () {
    this.Loading = true
    axios({
      method: 'get',
      url: 'http://localhost:3001/api/v1/products/',
      params:{
        skip: this.Skip,
        limit: 4,
        Filters: 'Name:/' + this.ProductName + '/'
      },
      headers: {
        'Authorization' : 'Bearer '+ localStorage.getItem('AuthCode')
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
  },
  methods: {
    search () {
      this.Loading = true
      axios({
        method: 'get',
        url: 'http://localhost:3001/api/v1/products/',
        params:{
          skip: this.Skip,
          limit: 4,
          Filters: 'Name:/' + this.ProductName + '/'
        },
        headers: {
          'Authorization' : 'Bearer '+ this.$store.getters.getAuthCode
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
    }
  }
}
</script>
