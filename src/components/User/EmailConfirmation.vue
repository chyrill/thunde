<template>
</template>

<script>
    import axios from 'axios';
    
    export default {
        name: 'EmailConfirmation',
        data () {
            return 
            {
                
            }
        },
        mounted () {
            axios.post('http://localhost:3000/api/v1/UserLogin/'+ this.$route.query.id)
                .then(response => {
                    localStorage.setItem('Token', response.data.model.Token)
                    this.$store.dispatch('jwtdecode', response.data.model.Token)
                    this.$router.push('/')
            })
                .catch(err => {
                this.$router.push('/')
            })
        }
    }
</script>