<template>
	<v-container>
			<v-card>
				<v-toolbar color="primary" dark>
					<v-toolbar-title>Purchase Order</v-toolbar-title>
				</v-toolbar>
				<v-card-text>
					<v-data-table v-bind:headers="PurchaseOrderHeader" :items="PurchaseOrderList" hide-actions class="elevation-1">
						<template slot="items" slot-scope="props">
							<td>{{props.item.CustomerName}}</td>
							<td>{{props.item.CompanyName}}</td>
							<td>{{props.item.Status}}</td>
							<td>{{props.item.TotalAmount}}</td>
							<td>{{props.item.DateCreated}}</td>
						</template>
					</v-data-table>
				</v-card-text>
			</v-card>
		</v-layout>
	</v-container>
</template>


<script>
	import { productUrl } from '../../helpers/apiurl'
	import axios from 'axios'

	export default {
		name: 'purchaseOrder',
		data () {
			return {
				PurchaseOrderHeader: [
					{
						text: 'Customer Name',
						align: 'center',
						value: 'CustomerName'
					},
					{
						text: 'Company Name',
						align: 'center',
						value: 'CompanyName'
					},
					{
						text: 'Status',
						align: 'center',
						value: 'Status'
					},
					{
						text: 'Amount',
						align: 'center',
						value: 'TotalAmount'
					},
					{
						text: 'Date Purchased',
						align: 'center',
						value: 'DateCreated'
					}
				],
				PurchaseOrderList: []
			}
		},
		mounted () {
			this.getPurchaseOrder()
		},
		computed: {

		},
		methods: {
			getPurchaseOrder () {
				axios({
					method: 'get',
					url: productUrl + '/api/v1/purchaseorder',
					params: {
						limit: 1000,
						sort: 'DateCreated:' + '-1'
					},
					headers: {
						'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
					}
				})
				.then(response => {
					this.PurchaseOrderList = response.data.items
				})
				.catch(err => {
					
				})
			}
		}
	}
</script>