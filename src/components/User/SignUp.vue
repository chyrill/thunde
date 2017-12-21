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
          <v-stepper-step step="2">
            Personal Information
          </v-stepper-step>
          <v-stepper-content step="2">
            <PersonalInformationForm/>
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

export default {

  name: 'SignUp',
  data () {
    return {
      Stepper: 1,
      LoginDetails: {}
    }
  },
  computed: {

  },
  methods: {
    getData (value) {
      this.LoginDetails = value
      this.Stepper = 2
      console.log(this.LoginDetails)
    }
  },
  components: {
    LoginDetailsForm,
    PersonalInformationForm
  }
}
</script>
