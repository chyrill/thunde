<template>
	<v-container>
		<v-card>
			<v-toolbar color="primary" dark>
				<v-toolbar-title>Delivery</v-toolbar-title>
				<v-btn color="error" dark fab absolute right bottom @click="addDeliveryDialog=!addDeliveryDialog"><v-icon>add</v-icon></v-btn>
			</v-toolbar>
			<v-card-text>
				<v-data-table hide-actions v-bind:headers="deliveryHeaders" :items="deliveryList" class="elevation-1">
					<template slot="items" slot-scope="props">
						<td>{{props.item.DeliveryReceiptId}}</td>
						<td>{{props.item.CreatedBy}}</td>
						<td>{{props.item.DateDelivered}}</td>
						<td>{{props.item.Status}}</td>
					</template>
				</v-data-table>
			</v-card-text>
		</v-card>
		<!-- delivery form -->
		<v-dialog v-model="addDeliveryDialog" max-width="900">
			<DeliveryForm @close="closeDialog"/>
		</v-dialog>
		<!-- end -->
	</v-container>
</template>


<script>
	import axios from 'axios'
	import DeliveryForm from './Forms/deliveryform'
	import { productUrl } from '../../helpers/apiurl'

	export default {
		name: 'delivery',
		data () {
			return {
				deliveryHeaders: [
					{
						text: 'Delivery Reciept No',
						align: 'center',
						value: 'DeliveryReceiptId'
					},
					{
						text: 'Received By',
						align: 'center',
						value: 'CreatedBy'
					},
					{
						text: 'Date Received',
						align: 'center',
						value: 'DateDelivered'
					},
					{
						text: 'Status',
						align: 'center',
						value: 'Status'
					}
				],
				deliveryList: [],
				addDeliveryDialog: false
			}
		},
		mounted () {
			this.getDelivery()
		},
		computed: {

		},
		methods: {
			closeDialog () {
				this.addDeliveryDialog = !this.addDeliveryDialog
				this.getDelivery()
			},
			getDelivery () {
				axios({
					method: 'get',
					url: productUrl + '/api/v1/delivery',
					params: {
						sort: "DateCreated:" + "-1",
						limit: 100
					},
					headers: {
						'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
					}
				})
				.then(response => {
					this.deliveryList = response.data.items
				})
				.catch(err => {
					
				})
			}
		},
		components: {
			DeliveryForm
		}
	}
</script>