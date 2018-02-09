<template>
	<v-container fluid>
		<v-layout row wrap>
			<!-- Purchase Order Table -->
			<v-flex xs12>
				<v-card>
					<v-toolbar color="primary" dark>
						<v-toolbar-title>Your Purchase</v-toolbar-title>
					</v-toolbar>
					<v-card-text>
						<v-layout row wrap>
							<v-flex xs10 offset-xs1 v-if="!isLoading">
								<v-data-table v-bind:headers="PurchaseOrderheaders" :items="" hide-actions class="elevation-1">
									<template slot="items" slot-scope="props">
										<td>{{props.item.PurchaseOrderNo}}</td>
										<td>{{props.item.Status}}</td>
										<td>{{props.item.TotalAmount}}</td>
										<td>{{props.item.DateCreated}}</td>
										<td><v-btn icon flat @click="getPurchaseItem(props.item._id)"><v-icon>visibility</v-icon></v-btn></td>
									</template>
								</v-data-table>
							</v-flex>
							<v-flex xs10 offset-xs1 v-if="isLoading">
							</v-flex>
						</v-layout>
					</v-card-text>
				</v-card>
			</v-flex>
			<!-- end of purchase Order Table -->
			<!-- Payment Table -->
			<v-flex xs12>
				<v-card>
					<v-toolbar color="primary" dark extended>
						<v-toolbar-title>Payment History</v-toolbar-title>
						<v-btn color="pink" dark absolute bottom right fab @click="AddPaymentDialog=!AddPaymentDialog"><v-icon>plus</v-icon></v-btn>
					</v-toolbar>
					<v-card-text>
						<v-layout row wrap>
							<v-flex xs10 offset-xs1>
								<v-data-table v-bind:headers="Paymentheaders" :items="PaymentList" hide-actions class="elevation-1">
									<template slot="items" slot-scope="props">
										<td>{{props.item.PaymentNo}}</td>
										<td>{{props.item.PurchaseOrderNo}}</td>
										<td>{{props.item.Status}}</td>
										<td>{{props.item.Amount}}</td>
										<td>{{props.item.DateCreated}}</td>
									</template> 
								</v-data-table>
							</v-flex>
						</v-layout>
					</v-card-text>
				</v-card>
			</v-flex>
			<!-- end of Payement Table -->
			<!-- dialog for Purchase Item -->
			<v-dialog v-model="PurhcaseOrderItemDialog" max-width="600">
				<v-card>
					<v-card-media color="primary" dark height="300px">
						<v-card-title>
							<h3>Purchase Order Information</h3>
						</v-card-title>
					</v-card-media>
					<v-list two-line>
						<v-list-tile avatar>
							<v-list-tile-content>
								<v-list-tile-title>Purchase Order Number</v-list-tile-title>
								<v-list-tile-sub-title>{{PurchaseOrderItem.PurchaseOrderNo}}</v-list-tile-sub-title>
							</v-list-tile-content>
						</v-list-tile>
						<v-list-tile avatar>
							<v-list-tile-content>
								<v-list-tile-title>Date Purchase</v-list-tile-title>
								<v-list-tile-sub-title>{{PurchaseOrderItem.DateCreated}}</v-list-tile-sub-title>
							</v-list-tile-content>
						</v-list-tile>
						<v-list-tile avatar>
							<v-list-tile-content>
								<v-list-tile-title>Status</v-list-tile-title>
								<v-list-tile-sub-title>{{PurchaseOrderItem.Status}}</v-list-tile-sub-title>
							</v-list-tile-content>
						</v-list-tile>
					</v-list>
					<v-divider></v-divider>
					<v-list two-line subheader>
						<v-subheader>Items</v-subheader>
						<v-list-tile avatar v-for="item in PurchaseOrderItem.Items">
							<v-list-tile-content>
								<v-list-tile-title>{{item.Name}}</v-list-tile-title>
								<v-list-tile-sub-title>{{item.Quantity}}</v-list-tile-sub-title>
								<v-list-tile-sub-title>{{item.UnitPrice}}</v-list-tile-sub-title>
								<v-list-tile-sub-title>{{item.TotalAmount}}</v-list-tile-sub-title>
							</v-list-tile-content>
						</v-list-tile>
					</v-list>
					<v-divider></v-divider>
					<v-list two-line>
						<v-list-tile avatar>
							<v-list-tile-content>
								<v-list-title>Total Amount</v-list-title>
								<v-list-tile-sub-title>{{PurchaseOrderItem.TotalAmount}}</v-list-tile-sub-title>
							</v-list-tile-content>
						</v-list-tile>
					</v-list>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn flat color="error" @click="PurhcaseOrderItemDialog = !PurhcaseOrderItemDialog">close</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<!-- end of dialog for purchase item -->
			<!-- dialog for payment -->
			<v-dialog v-model="AddPaymentDialog" max-width="500">
				<AddPaymentForm @closeForm="closeDialog" />
			</v-dialog>
			<!-- end of dialog payment -->
		</v-layout>
	</v-container>
</template>


<script>
	import AddPaymentForm from './forms/addpaymentform'	

	export default {
		name: 'MyTransactions',
		data () {
			return {
				PurchaseOrderheaders: [
					{
						text: 'Purchase Order No.',
						align: 'center',
						value: 'PurchaseOrderNo'
					},
					{
						text: 'Status',
						align: 'center',
						value: 'Status'
					},
					{
						text: 'Total Amount',
						align: 'center',
						value: 'TotalAmount'
					},
					{
						text: 'Purchased Date',
						align: 'center',
						value: 'DateCreated'
					},
					{
						text: ''
					}
				],
				Paymentheaders: [
					{
						text: 'Receipt No.',
						align: 'center',
						value: 'PaymentNo'
					},
					{
						text: 'Purchase Order No.',
						align: 'center',
						value: 'PuchaseOrderNo'
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
						text: 'Paid Date',
						align: 'center',
						value: 'DateCreated'
					}
				],
				PurchaseOrderList: [],
				PurchaseOrderItem: {},
				isLoading: false,
				PurhcaseOrderItemDialog: false,
				PaymentList: [],
				AddPaymentDialog: false,
				DropDownPurchaseOrderList: [],
				PaymentMethods: ['Bank Deposit - BDO', 'Bank Deposit - BPI', 'Bank Deposit - RCBC', 'Bank Deposit - Other Bank'],
				ReferenceNo: '',
				Amount: 0
			}
		},
		mounted () {
			this.getPurchaseOrderList()
			this.getPurchaseItem()
			this.getPaymentList()
		},
		computed: {
			User () {
				return this.$store.getters.getUser
			}
		},
		methods: {
			getPurchaseOrderList () {
				var user = this.$store.getters.getUser
				this.isLoading = true

				axios({
					method: 'get',
					url: 'http://localhost:3001/api/v1/purchaseorder',
					params: {
						Filters: 'UserId:/' + user.UserId + '/',
						sort: '-DateCreated'
					},
					headers: {
						'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
					}
				})
				.then(response => {
					this.PurchaseOrderList = response.data.items
					this.isLoading = false
				})
				.catch(err => {
					this.isLoading = false
				})
			},
			getPurchaseItem (id) {
				axios({
					method: 'get',
					url: 'http://localhost:3001/api/v1/purchaseorder/' + id,
					headers: {
						'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
					}
				})
				.then(response => {
					this.PurchaseOrderItem = response.data.model
				})
				.catch(err => {
					
				})
			},
			getPaymentList () {
				var user = this.$store.getters.getUser
				axios({
					method: 'get',
					url: 'http://localhost:3002/api/v1/payment',
					params: {
						Filters: 'UserId:/' + user.UserId + '/',
						sort: '-DateCreated'
					},
					headers: {
						'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
					}
				})
				.then(response => {
					this.PaymentList = response.data.model
				})
				.catch(err => {
					
				})
			},
			closeDialog () {
				this.AddPaymentDialog = !this.AddPaymentDialog
				this.getPaymentList()
			}
		},
		components: {
			AddPaymentForm
		}
	}
</script>