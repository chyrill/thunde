<template>
	<v-container>
		<v-card>
			<v-toolbar color="primary" dark>
				<v-toolbar-title>Payments</v-toolbar-title>
				<v-btn fab absolute bottom right color="error" dark @click="addPaymentDialog=!addPaymentDialog"><v-icon>add</v-icon></v-btn>
			</v-toolbar>
			<v-card-text>
				<v-data-table v-bind:headers="PaymentListHeader" :items="PaymentList" hide-actions class="elevation-1">
					<template slot="items" slot-scope="props">
						<td>{{props.item.PaymentNo}}</td>
						<td>{{props.item.PaymentType}}</td>
						<td>{{props.item.ReferenceNo}}</td>
						<td>{{props.item.Amount}}</td>
						<td>{{props.item.DateCreated}}</td>
						<td><v-switch v-model="props.item.Verified" @change="verifyPayment(props.item._id, props.item.PurchaseOrderId, props.item.Amount)" :disabled="props.item.Verified"></v-switch></td>
					</template>
				</v-data-table>
			</v-card-text>
		</v-card>
		<v-snackbar :timeout="snackbar.Timeout" :color="snackbar.Color" top v-model="Snackbar">
		    {{ snackbar.Message }}
		    <v-btn flat dark @click="Snackbar = !Snackbar"><v-icon>{{snackbar.Actions}}</v-icon></v-btn>
		</v-snackbar>
		<!-- payment dialog -->
		<v-dialog max-width="700" v-model="addPaymentDialog">
			<PaymentForm @close="closeDialog"/>
		</v-dialog>
		<!-- end -->
	</v-container>
</template>


<script>
	import { transactionUrl, productUrl } from '../../helpers/apiurl'
	import axios from 'axios'
	import PaymentForm from './form/paymentform'
	export default {
		name: 'payments',
		data () {
			return {
				PaymentListHeader: [
					{
						text: 'Payment Number',
						align: 'center',
						value: 'PaymentNo'
					},
					{
						text: 'Payment Method',
						align: 'center',
						value: 'PaymentType'
					},
					{
						text: 'Reference Number',
						align: 'center',
						value: 'ReferenceNo'
					},
					{
						text: 'Amount',
						align: 'center',
						value: 'Amount'
					},
					{
						text: 'Paid Date',
						align: 'center',
						value: 'DateCreated'
					},
					{
						text: 'Verified',
						align: 'center',
						value: 'Verified'
					}
				],
				PaymentList: [],
				snackbar: {
					Color: '',
					Timeout: 6000,
					Actions: '',
					Message: ''
				},
				Snackbar: false,
				addPaymentDialog: false
			}
		},
		mounted () {
			this.getPaymentList()
		},
		computed: {

		},
		methods: {
			getPaymentList () {
				axios({
					method: 'get',
					url: transactionUrl + '/api/v1/payment',
					params: {
						sort: 'DateCreated:' + '-1',
						limit: 1000
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
			},
			verifyPayment (id, POId, amount) {
				axios({
					method: 'post',
					url: transactionUrl + '/api/v1/payment/verify/' + id ,
					headers: {
						'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
					}
				})
				.then(response => {
					this.updatePurchaseOrder(POId, amount)
				})
				.catch(err => {
					this.activateSnackbar('error', 'Error in verifying payment', 'close')
				})
			},
			activateSnackbar(color, message, actions) {
				this.snackbar.Color = color
				this.snackbar.Message = message
				this.snackbar.Actions  = actions

				this.Snackbar = !this.Snackbar
			},
			updatePurchaseOrder (id, amount) {
				axios({
					method: 'put',
					url: productUrl + '/api/v1/purchaseorder/' + id + '/payment/' + amount,
					headers: {
						'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
					}
				})
				.then(response => {
					this.activateSnackbar('success', response.data.message, 'check')
				})
				.catch(err => {
					this.activateSnackbar('error', 'Error in verifying payment', 'close')
				})
			},
			closeDialog () {
				this.addPaymentDialog = !this.addPaymentDialog
				this.getPaymentList()
			}
		},
		components: {
			PaymentForm
		}
	}
</script>