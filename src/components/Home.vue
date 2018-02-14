<template>
	<v-container fluid grid-list-md>
		<v-layout wrap>
			<v-flex xs12>
				<v-parallax src="http://localhost:4000/uploads/water_cover1.jpg" style="height:500px">
					<v-layout column align-center justify-center>
						<h1 style="color:black">Blaise Scientific Trading</h1>
						<v-btn color="success" to="/products">Shop now</v-btn>
					</v-layout>
				</v-parallax>
			</v-flex>
			<v-flex xs12>
				<h1>Our Featured Products</h1>
			</v-flex>
			<template v-for="product in Products">
				<v-flex xs3>
					<v-card flat hover>
						<v-card-media :src="product.Images[0]" height="200px">
						</v-card-media>
						<v-card-title>
							<h2>{{product.Name}}</h2>
						</v-card-title>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn flat color="success" icon><v-icon>add_shopping_cart</v-icon></v-btn>
						</v-card-actions>
					</v-card>
				</v-flex>
			</template>
		</v-layout>
	</v-container>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Home',
  data () {
    return {
    	Products: []
    }
  },
  mounted () {
  	this.getProducts()
  },
  methods: {
  	getProducts () {
  		axios({
  			method: 'get',
  			url: 'http://localhost:3001/api/v1/products',	
  			params: {
  				Context: localStorage.getItem('Context'),
  				limit: 4
  			},
  			headers: {
  				'Authorization' : 'Bearer ' + localStorage.getItem('Context')
  			}
  		})
  		.then(response => {
  			this.Products = response.data.items
  		})
  		.catch(err => {
  			
  		})
  	}
  }
}
</script>
