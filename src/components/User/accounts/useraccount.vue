<template>
  <v-container fluid>
    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>User Accounts</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-data-table v-bind:headers="accountHeaders" :items="userAccounts" hide-actions class="elevation-1">
        <template slot="items" slot-scope="props">
          <td>{{props.item.FullName}}</td>
          <td>{{props.item.Address}}</td>
          <td>{{props.item.Email}}</td>
          <td>{{props.item.MobileNumber}}</td>
          <td>{{props.item.DateCreated}}</td>
        </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>


<script>
  import axios from 'axios'
  import { leadUrl } from '../../../helpers/apiurl'
  export default {
    name: 'UserAccount',
    data () {
      return {
        accountHeaders: [
          {
            text: 'Name',
            align: 'center',
            value: 'FullName'
          },
          {
            text: 'Address',
            align: 'center',
            value: 'Address'
          },
          {
            text: 'Email',
            align: 'center',
            value: 'Email'
          },
          {
            text: 'Mobile Number',
            align: 'center',
            value: 'MobileNumber '
          },
          {
            text: 'Date Joined',
            align: 'center',
            value: 'DateCreated'
          }
        ],
      userAccounts: [],
      addUserDialog: false
      }
    },
    methods: {
      getUsers () {
        axios({
          method: 'get',
          url: leadUrl + '/api/v1/client',
          params: {
            limit: 1000
          },
          headers: {
            'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
          }
        })
        .then(response => {
          this.userAccounts = response.data.items
        })
        .catch(err => {
          
        })
      }
    },
    mounted () {
      this.getUsers()
    },
    watch () {

    },
    computed: {

    },
    components: {
    }
  }
</script>
