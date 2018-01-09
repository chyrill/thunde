<template>
  <v-container grid-list-md fluid>
    <v-layout row wrap>
      <v-flex xs12>
        <v-carousel>
          <v-carousel-item
            v-for="(item,i) in Product.Images"
            v-bind:key="i"
            v-bind:src="item"
            transition="fade"
            reverseTransition="fade"
          >
          </v-carousel-item>
        </v-carousel>
      </v-flex>
      <v-flex xs12>
        <h1>{{Product.Name}}</h1>
      </v-flex>
      <v-flex xs12>
        <v-layout row wrap>
          <v-flex xs4>
            <p><b>SKU:</b> {{Product.SKU}}</p>
          </v-flex>
          <v-flex xs4>
            <p><b>Category:</b> {{Product.Category}}</p>
          </v-flex>
          <v-flex xs4>
            <p><b>Product Type:</b> {{Product.ProductType}}</p>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 style="text-align:justify">
        <b>Description :</b> <p v-html="Product.Description"></p>
      </v-flex>
      <v-flex xs12 style="text-align:justify">
        <b>Features :</b> <p v-html="Product.Features"></p>
      </v-flex>
      <v-flex xs12 style="text-align:justify" v-if="forAdmin">
       <v-divider></v-divider>
      </v-flex>
      <v-flex xs12 style="text-align:center" v-if="forAdmin">
        <h3 style="color:blue">Price Information</h3>
      </v-flex>
      <v-flex xs12 v-if="forAdmin">
        <v-layout row  wrap>
          <v-flex xs6>
            <p><b>Currency:</b> {{Product.Price.Currency}} </p>
          </v-flex>
           <v-flex xs6>
            <p><b>Amount:</b> {{Product.Price.Amount}} </p>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 v-if="forAdmin">
        <v-divider/>
      </v-flex>
      <v-flex xs12 style="text-align:center" v-if="forAdmin">
        <h3 style="color:blue">Supplier Information</h3>
      </v-flex>
      <v-flex xs12 style="text-align:justify" v-if="forAdmin">
        <p><b>Supplier Name:</b> {{Product.OtherInformation.SupplierName}}</p>
      </v-flex>
      <v-flex xs12 style="text-align:justify" v-if="forAdmin">
        <p><b>Supplier Address:</b> {{Product.OtherInformation.SupplierAddress}}</p>
      </v-flex>
      <v-flex xs12 style="text-align:justify" v-if="forAdmin">
        <span style="text-align:center"><h4>Contact Information</h4></span> <br/>
        <p><b>Contact Number:</b> {{Product.OtherInformation.SupplierContactNumber}}</p>
        <p><b>Email Address:</b> {{Product.OtherInformation.SupplierEmail}}</p>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
import axios from 'axios'

export default {
  name: 'ProductView',
  props: ['id'],
  data () {
    return {
      Product: {},
      forAdmin: localStorage.getItem('forAdmin')
    }
  },
  computed: {
    changeId () {
      return this.id
    }
  },
  watch: {
    changeId (value) {
     axios({
      method: 'get',
      url: 'http://localhost:3001/api/v1/products/' + this.id,
      params: {
        Context: localStorage.getItem('Context')
      }
    })
      .then(response => {
        this.Product = response.data.model
      })
    }
  },
  mounted () {
    axios({
      method: 'get',
      url: 'http://localhost:3001/api/v1/products/' + this.id,
      params: {
        Context: localStorage.getItem('Context')
      }
    })
      .then(response => {
        this.Product = response.data.model
      })
  }
}
</script>
