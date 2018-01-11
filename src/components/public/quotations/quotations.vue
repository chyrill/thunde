<template>
<v-container>
  <v-card>
    <v-toolbar dark color="primary"><v-toolbar-title>Quotations</v-toolbar-title></v-toolbar>
    <v-card-text>
      <v-data-table
      v-bind:headers="headers"
      :items="items"
      hide-actions
      class="elevation-1"
    >
    <template slot="items" slot-scope="props">
      <td>{{props.item.UpdatedBy}}</td>
      <td>{{props.item.DateCreated}}</td>
      <td>{{props.item.DateUpdated}}</td>
      <td><v-btn icon flat @click="viewQuotation(props.item._id)"><v-icon>visibility</v-icon></v-btn></td>
    </template>
  </v-data-table>
    </v-card-text>
  </v-card>
  <v-dialog v-model="viewQuotationDialog" max-width="1200px">
<v-toolbar dark color="primary">
  <v-toolbar-title>Quotation Information</v-toolbar-title>
</v-toolbar>
    <v-card>
      <v-card-text>
        <table border="1">
          <tr>
            <td colspan="1"><b>Customer Name:</b></td> <td colspan="2">{{quotationItem.CreatedBy}}</td>
            <td colspan="1"><b>Quoted By:</b></td><td colspan="2">{{quotationItem.UpdatedBy}}</td>
          </tr>
          <tr>
            <td colspan="3"><b>Date Quoted:</b></td><td colspan="3">{{quotationItem.DateUpdated}}</td>
          </tr>
          <tr>
            <th>Quantity</th>
            <th>Product Name</th>
            <th>Product Image</th>
            <th>Description</th>
            <th>Features</th>
            <th>Price</th>
          </tr>
          <tr v-for="item in quotationItem.Items">
            <td>{{item.Quantity}}</td>
            <td>{{item.Name}}</td>
            <td>{{item.Images[0]}}</td>
            <td>{{item.Description}}</td>
            <td>{{item.Features}}</td>
            <td>{{item.TotalAmount}}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
              <td colspan="2"><b>Total Quote:</b></td><td colspan="1">{{quotationItem.TotalQuote}}</td>
          </tr>
        </table>
      </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="viewQuotationDialog=!viewQuotationDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-container>
</template>




<script>
import axios from 'axios'

export default{
  data () {
    return {
      viewQuotationDialog: false,
      quotationId: '',
      quotationItem: {},
      headers: [
        {
          text: 'Quoted By',
          value: 'UpdatedBy',
          align: 'center'
        },
        {
          text: 'Date Submitted',
          value: 'DateCreated',
          align: 'center'
        },
        {
          text: 'Date Quoted',
          value: 'DateUpdated',
          align: 'center'
        },
        {
          sortable: false
        }
      ],
      items: []
    }
  },
  mounted () {
    this.getQuotation()
  },
  methods: {
    getQuotation () {
      axios({
        method: 'get',
        url: 'http://ed132795.ngrok.io/api/v1/quotation/quote/' + this.$store.getters.getShoppingCart.UserId,
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
        }
      })
        .then(response=>{
          this.items = response.data.items
        })
    },
    getQuotationDetail () {
      axios({
        method: 'get',
        url: 'http://ed132795.ngrok.io/api/v1/quotation/' + this.quotationId,
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
        }
      })
        .then(response=>{
          this.quotationItem = response.data.model
        })
    },
    viewQuotation (value) {
      this.quotationId = value
      this.viewQuotationDialog = !this.viewQuotationDialog
      this.getQuotationDetail()
    }
  }
}
</script>
