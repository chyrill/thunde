<template>
	<v-container fluid grid-list-md>
		<v-layout wrap>
			<v-flex xs12>
				<v-parallax src="https://57a083f1.ngrok.io/uploads/water_cover1.jpg" style="height:500px">
					<v-layout column align-center justify-center>
						<h1 style="color:black">Blaise Scientific Trading</h1>
						<v-btn color="success" to="/products">Shop now</v-btn>
					</v-layout>
				</v-parallax>
			</v-flex>
      <v-flex xs4 offset-xs4 id="who">
        <h1>Who are we?</h1>
      </v-flex>
      <v-flex xs10 offset-xs1 id="who">
        <h3>BLAISE-SCIENTIFIC TRADING is a local company engaged in the distribution of laboratory equipment and supplies primarily for Water and Environmental Analysis. With a team of young, creative, dynamic & dedicated professionals, we are pushing all areas in providing solutions to the needs of our clients to attain their fulfilment. This company believes in serving our customers by providing the accurate response to the requirements of our customers. Hence, we are for any and every obligation to our wide spectrum.</h3>
      </v-flex>
      <v-flex xs4 offset-xs4 id="who">
        <h1>Our Vision And Mission</h1>
      </v-flex>
      <v-flex xs4 offset-xs1>
        <v-card>
          <v-card-title id="center">
            <h2>Vision</h2>
          </v-card-title>
          <v-card-text>
            <h3>Our vision is to be one of the frontrunners in providing solutions to Environmental and Water Analysis needs in the country. By carrying out this vision at every level of our organization, we will be recognized by our employees, customers and manufacturers as the best partner in the country, resulting in value for all.</h3>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs4 offset-xs2>
        <v-card>
          <v-card-title>
            <h2>Mission</h2>
          </v-card-title>
          <v-card-text>
            <h3>To Lead our field by bringing the most innovative technologies to our markets, and make quality, integrity, and excellent trademarks of the way we do business by attracting, developing, and motivating the best people and continually grow and improve our team’s technical expertise in meeting our customer’s needs.</h3>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs6 offset-xs3 id="product">
        <h1>Featured Products</h1>
      </v-flex>
      <v-flex xs4 v-for="product in Products" style="padding-bottom: 80px;">
        <v-card hover>
          <v-card-media :src="product.Images[0]" height="200px">
          </v-card-media>
          <v-card-title primary-title>
            <h3>{{product.Name}}</h3>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-footer height="auto">
          <v-card flat tile color="primary" dark max-width="100%" style="width:100%">
            <v-card-title>
              <h1><strong class="subheading">Get Connected</strong></h1>
              <v-spacer></v-spacer>
              <p>&copy {{new Date().getFullYear()}}</p>
            </v-card-title>
            <v-card-text>
              <v-flex xs3 layout column>
                <span style="padding-bottom: 30px">CONTACT</span>
                <div style="padding-bottom: 30px">
                  <v-icon size="20px" class="mr-3">home</v-icon>
                  94 Calaca St. NPC Village, Brgy. Sauyo
                </div>
                <div style="padding-bottom: 30px">
                  <v-icon size="20px" class="mr-3">email</v-icon>
                  blaisescientifictrading@gmail.com
                </div>
                 <div style="padding-bottom: 30px">
                  <v-icon size="20px" class="mr-3">phone</v-icon>
                  (02) 287-6743
                </div>
              </v-flex>
            </v-card-text>
          </v-card>
        </v-footer>
      </v-flex>
		</v-layout>
	</v-container>
</template>

<script>
import axios from 'axios'
import { productUrl } from '../helpers/apiurl'
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
  			url: productUrl + '/api/v1/products',
  			params: {
  				Context: localStorage.getItem('Context'),
  				limit: 3
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

<style>
  #banner {
    padding-bottom: 30px;
    margin: 0px;
    padding: 0;
  }
  #who {
    padding-bottom: 30px;
  }
  #center {
    text-align: 'center';
  }
  #product {
    padding-top: 50px;
    padding-bottom: 50px;
  }
</style>
