<template>
  <div>
  <v-card>
    <v-form>
      <v-container grid-list-xs>
        <v-flex xs10 offset-xs1>
          <v-text-field label="Last Name" v-model="LastName" :error-messages="lastNameErrors" @input="$v.LastName.$touch()" @blur="$v.LastName.$touch()" required></v-text-field>
        </v-flex>
        <v-flex xs10 offset-xs1>
          <v-text-field label="First Name" v-model="FirstName" :error-messages="firstNameErrors" @input="$v.FirstName.$touch()" @blur="$v.FirstName.$touch()" required></v-text-field>
        </v-flex>
        <v-flex xs10 offset-xs1>
          <v-text-field label="Middle Name" v-model="MiddleName" :error-messages="middleNameErrors" @input="$v.MiddleName.$touch()" @blur="$v.MiddleName.$touch()" ></v-text-field>
        </v-flex>
        <div v-if="DeviceHeight >= 960">
        <v-flex xs10 offset-xs1>
          <v-layout>
          <v-flex xs6>
            <v-text-field label="Address 1" v-model="Address1" :error-messages="address1Errors" @input="$v.Address1.$touch()" @blur="$v.Address1.$touch()" ></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field label="Address 2" v-model="Address2" :error-messages="address2Errors" @input="$v.Address2.$touch()" @blur="$v.Address2.$touch()" ></v-text-field>
          </v-flex>
        </v-layout>
        </v-flex>
        <v-flex xs10 offset-xs1>
          <v-layout>
            <v-flex xs4>
              <v-text-field label="City" v-model="City" :error-messages="cityErrors" @input="$v.City.$touch()" @blur="$v.City.$touch()" required></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-text-field label="State" v-model="State" :error-messages="stateErrors" @input="$v.State.$touch()" @blur="$v.State.$touch()" required></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-text-field label="Country" v-model="Country" :error-messages="countryErrors" @input="$v.Country.$touch()" @blur="$v.Country.$touch()" required ></v-text-field>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs10 offset-xs1>
          <v-layout>
            <v-flex xs4>
              <v-text-field label="Mobile Number" v-model="MobileNumber" :error-messages="mobileNumberErrors" @input="$v.MobileNumber.$touch()" @blur="$v.MobileNumber.$touch()" required></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-text-field label="Phone Number" v-model="PhoneNumber" :error-messages="phoneNumberErrors" @input="$v.PhoneNumber.$touch()" @blur="$v.PhoneNumber.$touch()"></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-text-field label="Zip Code" v-model="ZipCode" :error-messages="zipCodeErrors" @input="$v.ZipCode.$touch()" @blur="$v.ZipCode.$touch()" required ></v-text-field>
            </v-flex>
          </v-layout>
        </v-flex>
      </div>
      </v-container>
    </v-form>
  </v-card>
  <v-btn><v-icon left>navigate_before</v-icon> back</v-btn>  <v-btn color="indigo">next<v-icon right>navigate_next</v-icon></v-btn>
</div>
</template>

<script>
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
    LastName: {
      required,
      minLength: minLength(2)
    },
    FirstName: {
      required,
      minLength: minLength(2)
    },
    Address1: {
      required
    },
    City: {
      required
    },
    State: {
      required
    },
    Country: {
      required
    },
    MobileNumber: {
      required
    },
    ZipCode: {
      required
    }
  },
  name: 'PersonalInformationForm',
  data () {
    return {
      LastName: '',
      FirstName: '',
      MiddleName: '',
      Address1: '',
      Address2: '',
      DeviceHeight: document.documentElement.clientHeight,
      City: '',
      State: '',
      Country: '',
      MobileNumber: '',
      PhoneNumber: '',
      ZipCode: ''
    }
  },
  ready: function () {
    window.addEventListener('resize', this.HandleResize)
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.HandleResize)
  },
  computed: {
    lastNameErrors () {
      const errors = []
      if (!this.$v.LastName.$dirty) return errors
      !this.$v.LastName.required && errors.push('Last Name is required')
      !this.$v.LastName.minLength && errors.push('Last Name minimum length is 2')
      return errors
    },
    firstNameErrors () {
      const errors = []
      if (!this.$v.FirstName.$dirty) return errors
      !this.$v.FirstName.required && errors.push('First Name is required')
      !this.$v.FirstName.minLength && errors.push('First Name minimum length is 2')
      return errors
    },
    middleNameErrors () {

    },
    address1Errors () {
      const errors = []
      if (!this.$v.Address1.$dirty) return errors
      !this.$v.Address1.required && errors.push('Address 1 is required')
      return errors
    },
    address2Errors () {

    },
    cityErrors () {
      const errors = []
      if (!this.$v.City.$dirty) return errors
      !this.$v.City.required && errors.push('City is required')
      return errors
    },
    stateErrors () {
      const errors = []
      if (!this.$v.State.$dirty) return errors
      !this.$v.State.required && errors.push('City is required')
      return errors
    },
    countryErrors () {
      const errors = []
      if (!this.$v.Country.$dirty) return errors
      !this.$v.Country.required && errors.push('City is required')
      return errors
    },
    mobileNumberErrors () {
      const errors = []
      if (!this.$v.MobileNumber.$dirty) return errors
      !this.$v.MobileNumber.required && errors.push('Mobile Number is required')
      return errors
    },
    phoneNumberErrors () {

    },
    zipCodeErrors () {
      const errors = []
      if (!this.$v.ZipCode.$dirty) return errors
      !this.$v.ZipCode.required && errors.push('Zip Code is required')
      return errors
    }
  },
  methods: {
    HandleResize (event) {
      this.DeviceHeight = document.documentElement.clientHeight
      console.log(this.DeviceHeight)
    }
  }
}
</script>
