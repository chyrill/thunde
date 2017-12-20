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
            <v-card>
            <v-form ref="form" lazy-validation>
              <v-container grid-list-xs>
                <v-flex xs10 offset-xs1>
                  <v-text-field label="Email" v-model="Email" :error-messages="emailErrors" @input="$v.Email.$touch()" @blur="$v.Email.$touch()" required></v-text-field>
                </v-flex>
                <v-flex xs10 offset-xs1>
                  <v-text-field label="Password" type="password" v-model="Password" :error-messages="passwordErrors" @input="$v.Password.$touch()" @blur="$v.Password.$touch()" required></v-text-field>
                </v-flex>
                <v-flex xs10 offset-xs1>
                  <v-text-field label="Confirm Password" type="password" v-model="ConfirmPassword" :error-messages="confirmPasswordErrors" @input="$v.ConfirmPassword.$touch()" @blur="$v.ConfirmPassword.$touch()" required></v-text-field>
                </v-flex>
              </v-container>
            </v-form>
          </v-card>
          <v-spacer></v-spacer>
          <v-btn color="indigo" @click.native="Stepper=2" :disabled="$v.$invalid">Next <v-icon right>navigate_next</v-icon></v-btn>
          </v-stepper-content>
          <v-stepper-step step="2">
            Personal Information
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-card>
              <v-form>
                <v-container grid-list-xs>
                  <v-flex xs10 offset-xs1>
                    <v-text-field label="Last Name" v-model="LastName" :error-messages="lastNameErrors" @input="$v.LastName.$touch()" @blur="$v.LastName.$touch()" required></v-text-field>
                  </v-flex>
                </v-container>
              </v-form>
            </v-card>
            <v-btn color="indigo" @click.native="Stepper=3" :disabled="$v.$invalid"> Next <v-icon right>navigate_next</v-icon> </v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import {
  validationMixin
} from 'vuelidate'

import {
  required,
  minLength,
  email,
  sameAs
} from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  validations: {
    Email: {
      required,
      email
    },
    Password: {
      required,
      minLength: minLength(6)
    },
    ConfirmPassword: {
      required,
      minLength: minLength(6),
      samePassword: sameAs('Password')
    },
    LastName: {
      required
    }
  },
  name: 'SignUp',
  data () {
    return {
      Stepper: 1,
      valid: false,
      Email: '',
      Password: '',
      ConfirmPassword: '',
      LastName: ''
    }
  },
  computed: {
    emailErrors () {
      const errors = []
      if (!this.$v.Email.$dirty) return errors
      !this.$v.Email.email && errors.push('Must be valid e-mail')
      !this.$v.Email.required && errors.push('E-mail is required')
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.Password.$dirty) return errors
      !this.$v.Password.required && errors.push('Password is required')
      !this.$v.Password.minLength && errors.push('Password minimum length is 6')
      return errors
    },
    confirmPasswordErrors () {
      const errors = []
      if (!this.$v.ConfirmPassword.$dirty) return errors
      !this.$v.ConfirmPassword.required && errors.push('This is required')
      !this.$v.ConfirmPassword.minLength && errors.push('minimum length is 6')
      !this.$v.ConfirmPassword.samePassword && errors.push("Password doesn't match")
      return errors
    },
    lastNameErrors () {
      const errors = []
      if (!this.$v.LastName.$dirty) return errors
      !this.$v.LastName.required && errors.push('Last name is required')
      return errors
    }
  },
  methods: {
  }
}
</script>
