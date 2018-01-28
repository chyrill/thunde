<template>
</template>

<script>
    import axios from 'axios';
    import { userUrl } from '../../helpers/apiurl'

    export default {
        name: 'EmailConfirmation',
        data () {
            return
            {
              value: ''
            }
        },
        mounted () {
            axios.post('http://localhost:3000/api/v1/UserLogin/'+ this.$route.params.id)
                .then(response => {
                    localStorage.setItem('Token', response.data.model)
                    this.$store.dispatch('jwtdecode', response.data.model)
                    this.$router.push('/')
            })
                .catch(err => {
                this.$router.push('/')
            })
        }
    }
</script>
