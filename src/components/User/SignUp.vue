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
</v-container>
</template>

<script>
import LoginDetailsForm from './Forms/LoginDetailsForm'
import PersonalInformationForm from './Forms/PersonalInformationForm'
import CompanyInformationForm from './Forms/CompanyInformationForm'

export default {
  name: 'SignUp',
  data () {
    return {
      Stepper: 1,
      LoginDetails: {},
      PersonalInformation: {},
      Others: {},
      Data: {}
    }
  },
  computed: {

  },
  methods: {
    getData (value) {
      this.LoginDetails = value
      this.Stepper = 2
      console.log(this.LoginDetails)
    },
    submitPersonal (value) {
      this.PersonalInformation = value
      this.Stepper = 3
      console.log(this.PersonalInformation)
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
      this.Data['Others'] = this.Others
      console.log(this.Data)
    }
  },
  components: {
    LoginDetailsForm,
    PersonalInformationForm,
    CompanyInformationForm
  }
}
</script>
