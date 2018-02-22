<template>
	<v-card>
		<v-toolbar color="primary" dark>
			<v-toolbar-title>Add Delivery Information</v-toolbar-title>
		</v-toolbar>
		<v-progress-linear :indeterminate="isLoading" color="orange" v-if="isLoading"></v-progress-linear>
		<v-card-text>
			<v-layout row wrap>
				<v-flex xs10 offset-xs1>
					<v-text-field label="Delivery Reciept Number" v-model="DeliveryReceiptId"/>
				</v-flex>
				<v-flex xs4 offset-xs7 offset-xs1>
					<v-dialog
        			ref="dialog"
        			v-model="modal"
        			lazy
        			full-width
        			width="290px"
        			:return-value.sync="DateDelivered"
      				>
						<v-text-field slot="activator" prepend-icon="event" v-model="DateDelivered" label="Delivery Date" />
						<v-date-picker v-model="DateDelivered" scrollable>
					        <v-spacer></v-spacer>
				          	<v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
					        <v-btn flat color="primary" @click="$refs.dialog.save(DateDelivered)">OK</v-btn>
				        </v-date-picker>
				    </v-dialog>
				</v-flex>
				<v-flex xs4 offset-xs7 offset-xs1>
					<v-btn color="primary" dark @click="addItemList">Add item</v-btn>
				</v-flex>
				<v-container grid-md-list>
					<template v-for="(index,item) in Items">
						<v-flex xs10 offset-xs1>
							<v-card>
								<v-card-text>
									<v-select autocomplete :items="ProductList" item-value="_id" item-text="Name" v-model="index._id" label="Product Name" @input="placeName(item)"/>
									<v-select v-model="index.SerialNumber" multiple chips tags label="Serial Number" hint="press enter to add more serial number"/>
								</v-card-text>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn flat color="error" @click="deleteItem(item)">delete</v-btn>
								</v-card-actions>
							</v-card>
						</v-flex>
					</template>
				</v-container>
			</v-layout>
		</v-card-text>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn color="primary" :disabled="isLoading" flat>submit</v-btn>
			<v-btn color="error" :disabled="isLoading" flat>close</v-btn>
		</v-card-actions>
	</v-card>
</template>


<script>
	import axios from 'axios'
	import { productUrl } from '../../../helpers/apiurl'
	export default {
		name: '',
		data () {
			return {
				DeliveryReceiptId: '',
				DateDelivered: '',
				modal: false,
				Items: [],
				ProductList: [],
				isLoading: false
			}
		},
		mounted () {
			this.getProducts()
		},
		computed: {

		},
		methods: {
			addItemList () {
				let item = {
					Name: '',
					_id: '',
					SerialNumber: []
				}

				this.Items.push(item)
			},
			deleteItem (index) {
				this.Items.splice(index,1)
			},
			getProducts () {
				axios({
					method: 'get',
					url: productUrl + '/api/v1/products/',
					params: {
						Context: localStorage.getItem('Context'),
						limit: 1000
					},
					headers: {
						'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
					}
				})
				.then(response => {
					var items = response.data.items

					for (let item in items) {
						var data = items[item]

						let product = {
							Name: data.Name,
							_id: data._id
						}

						this.ProductList.push(product)
					}
				})
				.catch(err => {
					
				})
			},
			placeName (index) {
				var item = this.Items[index]
				var product = this.ProductList.filter(data => { return data._id == item._id })
				item.Name = product[0].Name

				console.log(this.Items)
			},
			submit () {

			}
		}
	}
</script>