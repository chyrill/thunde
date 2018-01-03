<template>
<v-container grid-list-md>
  <v-layout row wrap>
    <v-flex xs10 offset-xs1>
      <v-card dark color="primary">
        <v-card-text class="text-xs-center">
          <h2>Create Account</h2></v-card-text>
        <v-divider></v-divider>
        <v-stepper v-model="Stepper"  vertical>
          <v-stepper-step step="1" v-bind:complete="Stepper > 1">
            Login Credentials
          </v-stepper-step>
          <v-stepper-content step="1">
            <LoginDetailsForm @submit="getData" />
          </v-stepper-content>
          <v-stepper-step step="2" :complete ="Stepper > 2">
            Personal Information
          </v-stepper-step>
          <v-stepper-content step="2">
            <PersonalInformationForm @submit="submitPersonal" @cancel="cancel1"/>
          </v-stepper-content>
          <v-stepper-step step="3">
            Company Information
          </v-stepper-step>
          <v-stepper-content step="3">
            <CompanyInformationForm @back ="cancel2" @submit="submitAll"/>
          </v-stepper-content>
        </v-stepper>
      </v-card>
    </v-flex>
  </v-layout>
  <v-snackbar :timeout="snackbar.timeout" color="red" :top="snackbar.top" :multi-line="snackbar.multi" :vertical="snackbar.vertical" v-model="Snackbar"> {{Errors}} </v-snackbar>
</v-container>
</template>

<script>
import LoginDetailsForm from './Forms/LoginDetailsForm'
import PersonalInformationForm from './Forms/PersonalInformationForm'
import CompanyInformationForm from './Forms/CompanyInformationForm'
import axios from 'axios'
import {jwtDecode} from '../../helpers/jwtDecoder'
import jwt from 'jsonwebtoken'

export default {
  name: 'SignUp',
  data () {
    return {
      Stepper: 1,
      LoginDetails: {},
      PersonalInformation: {},
      Others: {},
      Data: {},
      Errors: '',
      Snackbar: false,
      snackbar: {
        timeout: 6000,
        top: true,
        multi: true,
        vertical: true
      }
    }
  },
  computed: {
    context () {
      this.Data['Context'] = this.$store.getters.getContext
    }
  },
  methods: {
    getData (value) {
      this.LoginDetails = value
      this.Stepper = 2
    },
    submitPersonal (value) {
      this.PersonalInformation = value
      this.Stepper = 3
    },
    cancel1 (value) {
      this.Stepper = value
    },
    cancel2 (value) {
      this.Stepper = value
    },
    submitAll (value) {
      this.Others = value
      for (let key in this.LoginDetails) {
        this.Data[key] = this.LoginDetails[key]
      }
      for (let key in this.PersonalInformation) {
        this.Data[key] = this.PersonalInformation[key]
      }
      this.Data['Context'] = this.$store.getters.getContext
      this.Data['Others'] = this.Others


      axios.post('http://localhost:3000/api/v1/userLogin/signup', this.Data)
        .then(response => {
          var userdata = jwt.verify(response.data.model.Token, 'blaiseSecretKey')
          this.$store.state.user = userdata.user
          this.$router.push('/')
        })
        .catch(err => {
          this.Errors = err.response.data.message
          this.Snackbar = true
        })
    }
  },
  components: {
    LoginDetailsForm,
    PersonalInformationForm,
    CompanyInformationForm
  }
}
</script>
