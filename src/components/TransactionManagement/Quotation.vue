<template>
  <v-container>
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title>Quotations</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-data-table
      v-bind:headers="headers"
      :items="items"
      hide-actions
      class="elevation-1"
    >
    <template slot="items" slot-scope="props">
      <td>{{ props.item.CreatedBy }}</td>
       <td>{{ props.item.DateCreated }}</td>
       <td><v-btn icon @click="openEditDialog(props.item._id)"><v-icon>edit</v-icon></v-btn></td>
    </template>
  </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="editViewDialog" max-width="800px">
              <v-toolbar dark color="primary">
                 <v-toolbar-title>Quotation Information</v-toolbar-title>
              </v-toolbar>
                   <v-card>
                    <v-card-text>
                      <v-container>
                        <v-layout row wrap>
                          <v-flex xs10 offset-xs1 style="text-align:justify">
                            <p><b>Customer Name:</b>  {{quotationItem.CreatedBy}}</p>
                          </v-flex>
                          <v-flex xs10 offset-xs1 style="text-align:justify">
                            <p><b>Date Created:</b>  {{quotationItem.DateCreated}}</p>
                          </v-flex>
                          <v-flex xs10 offset-xs1 style="text-align:justify">
                            <p><h3>Items:</h3> </p>
                          </v-flex>
                          <template v-for="item in quotationItem.Items">
                          <v-flex xs10 offset-xs1>
                            <v-layout row wrap>
                              <v-flex xs4>
                                <b>{{item.Name}} </b>
                              </v-flex>
                              <v-flex xs4>
                                {{item.Quantity}} items
                              </v-flex>
                              <v-flex xs4>
                                <v-text-field type="number" label="Amount" v-model="item.TotalAmount"  @keyup="getTotalQuote"/>
                              </v-flex>
                            </v-layout>
                          </v-flex>
                        </template>
                        <v-flex xs4 offset-xs8>
                          <p><b>Amount: </b>{{totalQuote}}</p>
                        </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="submit()">Submit Quotation</v-btn>
                       <v-btn flat color="error" @click="editViewDialog=!editViewDialog">Close</v-btn>
                    </v-card-actions>
                   </v-card>
                 </v-dialog>
  </v-container>
</template>



<script>
import axios from 'axios'

export default {
  data () {
    return {
      editItemId: '',
      editViewDialog: false,
      items: [],
      headers: [
        {
          text: 'Customer Name',
          align: 'center',
          value: 'CreatedBy'
        },
        {
          text: 'Date Created',
           align: 'center',
           value: 'DateCreated'
        },
        {
           sortable: false
        }
      ],
      quotationItem: {},
      totalQuote: 0
    }
  },
  mounted () {
    this.getQuotation()
  },
  methods: {
    getQuotation () {
      axios({
        method: 'get',
        url: 'http://localhost:3002/api/v1/quotation/new',
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
        }
      })
        .then(response => {
          this.items = response.data.items
        })
    },
    getTotalQuote () {
      this.quotationItem['TotalQuote'] = 0
      for (let item in this.quotationItem.Items) {
        var amount =parseFloat(this.quotationItem.Items[item].TotalAmount)
        var qoute = parseFloat(this.totalQuote)
        this.totalQuote = qoute + amount
        this.quotationItem.TotalQuote = this.totalQuote
      }
    },
    submit () {
      console.log(this.quotationItem)
    },
    openEditDialog (value) {
      this.editItemId = value
      this.editViewDialog = !this.editViewDialog
      this.getQuotationById()
    },
    getQuotationById () {
      axios({
        method: 'get',
        url: 'http://localhost:3002/api/v1/quotation/' + this.editItemId,
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
        }
      })
        .then(response => {
          this.quotationItem = response.data.model
          for (let item in this.quotationItem.Items) {
            this.quotationItem.Items[item]['TotalAmount'] =  parseFloat(this.quotationItem.Items[item].Price.Amount * this.quotationItem.Items[item].Quantity);
            this.totalQuote = parseFloat(this.totalQuote+this.quotationItem.Items[item].Price.Amount * this.quotationItem.Items[item].Quantity) ;
          }
        })
    }
  }
}
</script>
