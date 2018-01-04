<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs10 offset-xs1>
        <v-card dark color="primary">
          <v-card-text class="text-xs-center">
            <h2>Sign In</h2>

          </v-card-text>
              <SignInForm @submit="submit"/>
        </v-card>
      </v-flex>
    </v-layout>
    <v-snackbar :timeout="snackbar.timeout" color="red" :top="snackbar.top" :multi-line="snackbar.multi" :vertical="snackbar.vertical" v-model="Snackbar"> {{Errors}} </v-snackbar>
  </v-container>
</template>

<script>
import SignInForm from './Forms/SignInForm'
import axios from 'axios'

export default {
  name: 'SignIn',
  data () {
    return {
      Errors: '',
      Snackbar: false,
      snackbar: {
        timeout: 6000,
        top: true,
        multi: false,
        vertical: false
      }
    }
  },
  components: {
    SignInForm
  },
  computed: {
    User () {
      return this.$store.getters.getUser
    }
  },
  watch: {
    User (value) {
      if (value.AccessLevel !== 4) {
        this.$router.push('/admin/dashboard')
      }
      else {
        this.$router.push('/')
      }
    }
  },
  methods: {
    submit (value) {
      value['Context'] = this.$store.getters.getContext
      axios.post('http://localhost:3000/api/v1/userLogin/login',value)
        .then( response => {
          localStorage.setItem('Token', response.data.model.Token)
          this.$store.dispatch('jwtdecode', response.data.model.Token)
        })
        .catch( err => {
          console.log(err.response.data)
          this.Errors = err.response.data.message
          this.Snackbar = true
        })
    }
  }
}
</script>
