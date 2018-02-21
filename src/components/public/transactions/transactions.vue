<template>
	<v-container fluid grid-list-md>
		<v-layout row wrap>
			<!-- Purchase Order Table -->
			<v-flex xs10 offset-xs1>
				<v-card>
					<v-toolbar  color="primary" dark>
						<v-toolbar-title>My Purchase Orders</v-toolbar-title>
					</v-toolbar>
					<v-card-text>
						<v-data-table v-bind:headers="PurchaseOrderHeaders" :items="PurchaseOrderList" hide-actions class="elevation-1">
							<template slot="items" slot-scope="props">
								<td>{{props.item.PurchaseOrderNo}}</td>
								<td>{{props.item.TotalAmount}}</td>
								<td>{{props.item.Status}}</td>
								<td>{{props.item.DateCreated}}</td>
								<td><v-btn flat icon><v-icon>visibility</v-icon></v-btn></td>
							</template>
						</v-data-table> 
					</v-card-text>
				</v-card>
			</v-flex>
			<!-- End of Purchase Order Table -->
			<!-- Payment table -->
			<v-flex xs10 offset-xs1>
				<v-card>
					<v-toolbar color="primary" dark extended>
						<v-toolbar-title slot="extension">My Payments</v-toolbar-title>
						<v-btn fab absolute bottom right color="error" @click="addPaymentDialog=!addPaymentDialog" dark><v-icon>add</v-icon></v-btn>
					</v-toolbar>
					<v-card-text>
						<v-data-table v-bind:headers="PaymentListHeaders" :items="PaymentList" hide-actions class="elevation-1">
							<template slot="items" slot-scope="props">
								<td>{{props.item.PaymentNo}}</td>
								<td>{{props.item.PaymentType}}</td>
								<td>{{props.item.Verified ? 'Verified': 'Not Verified'}}</td>
								<td>{{props.item.Amount}}</td>
								<td>{{props.item.DateCreated}}</td>
							</template>
						</v-data-table>
					</v-card-text>
				</v-card>
			</v-flex>
			<!-- end of payment table -->
		</v-layout>
		<!-- dialog box for payment -->
		<v-dialog v-model="addPaymentDialog" max-width="800px">
			<AddPaymentForm @close="addPaymentDialog=!addPaymentDialog"/>
		</v-dialog>
		<!-- end dialog -->
	</v-container>
</template>


<script>
	import axios from 'axios'
	import { productUrl, transactionUrl } from '../../../helpers/apiurl'
	import AddPaymentForm from './form/addpayment'

	export default {
		name: 'MyTransactions',
		data () {
			return {
				PurchaseOrderHeaders: [
					{
						text: 'Purchase Order Number',
						align: 'center',
						value: 'PurchaseOrderNo'
					},
					{
						text: 'Amount',
						align: 'center',
						value: 'TotalAmount'
					},
					{
						text: 'Status',
						align: 'center',
						value: 'Status'
					},
					{
						text: 'Date Purchased',
						align: 'DateCreated',
						value: 'DateCreated'
					},
					{
						text: ''
					}
				],
				PurchaseOrderList: [],
				PaymentList: [],
				PaymentListHeaders: [
					{
						text: 'Payment Number',
						align: 'center',
						value: 'PaymentNo'
					},
					{
						text: 'Payment Type',
						align: 'center',
						value: 'PaymentType'
					},
					{
						text: 'Status',
						align: 'center',
						value: 'Status'
					},
					{
						text: 'Amount',
						align: 'center',
						value: 'Amount'
					}, 
					{
						text: 'Payment Date',
						align: 'center',
						value: 'DateCreated'
					}
				],
				addPaymentDialog: false
			}
		},
		methods: {
			getPuchaserOrderList () {
				var userId = localStorage.getItem('UserId') 

				axios({
					method: 'get',
					url: productUrl + '/api/v1/purchaseorder',
					params: {
						Filters: 'UserId:/' + userId + '/',
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
			},
			getPaymentList () {
				var userId = localStorage.getItem('UserId') 

				axios({
					method: 'get',
					url: transactionUrl + '/api/v1/payment',
					params: {
						Filters: 'UserId:/' + userId + '/',
						sort: 'DateCreated:' + '-1'
					},
					headers: {
						'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
					}
				})
				.then(response => {
					this.PaymentList = response.data.items
				})
				.catch(err => {
					
				})
			}
 		},
		computed: {

		},
		mounted () {
			this.getPuchaserOrderList()
			this.getPaymentList()
		},
		components: {
			AddPaymentForm
		}
	}
</script>