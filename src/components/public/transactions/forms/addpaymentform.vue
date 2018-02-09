<template>
	<v-container fluid>
		<v-card>
			<v-toolbar color="primary" dark>
				<v-toolbar-title>Add Payment</v-toolbar-title>
			</v-toolbar>
			<v-card-text>
				<v-layout row wrap>
					<template v-if="isLoading">
						<v-flex xs4 offset-xs4>
							<v-progress-circular indeterminate v-bind:size="70" v-bind:width:"9" color="error"></v-progress-circular>
						</v-flex>
					</template>
					<template v-if="!isLoading">
						<v-flex xs10 offset-xs1>
							<v-select :items="PurchaseItemList" item-value="_id" item-text="PurchaseOrderNo" label="Purchase Order No." v-model="PurchaseOrderId" :error-messages="purchaseOrderIdErrors" @blur="$v.PurchaseOrderId.$touch()" @input="$v.PurchaseOrderId.$touch()" required />
						</v-flex>
						<v-flex xs10 offset-xs1>
							<v-select :items="PaymentMethods" label="Payment Method" v-model="PaymentType" :error-messages="paymentTypeErrors" @blur="$v.PaymentType.$touch()" @input="$v.PaymentType.$touch" />
						</v-flex>
						<v-flex xs10 offset-xs1>
							<v-text-field v-model="ReferenceNo" label="Reference Number" :error-messages="referenceNumberErrors" @blur="$v.ReferenceNo.$touch()" @input="$v.ReferenceNo.$touch()" />
						</v-flex>
						<v-flex xs10 offset-xs1>
							<v-text-field v-model="Amount" label="Amount" :error-messages="amountErrors" @blur="$v.Amount.$touch()" @input="$v.Amount.$touch()" />
						</v-flex>
					</template>
				</v-layout>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="success" :disabled="isLoading" @click="submit">submit</v-btn>
				<v-btn color="error" :disabled="isLoading" @click="close">close</v-btn>
			</v-card-actions>
		</v-card>
		<v-snackbar :timeout="snackbarAtt.timeout" :color="snackbarAtt.color" top dark>{{snackbarAtt.message}}<v-spacer></v-spacer><v-icon>{{snackbarAtt.actions}}</v-icon></v-snackbar>
	</v-container>
</template>


<script>
	import {
		validationMixin
	} from 'vuelidate'

	import {
		required,
		minLength
	} from 'vuelidate/lib/validators'

	import axios from 'axios'

	export default {
		name: 'AddPaymentForm',
		mixins: [validationMixin],
		validations: {
			PurchaseOrderId: {
				required
			},
			PaymentType: {
				required
			},
			ReferenceNo: {
				required
			},
			Amount: {
				required
			}
		},
		data () {
			return {
				isLoading: false,
				PurchaseItemList: [],
				User: {},
				VerifiedPaymentList: [],
				PaymentType: '',
				PaymentMethods: ['Bank Deposit-BDO', 'Bank Deposit-BPI', 'Bank Deposit-RCBC', 'Bank Deposit-Others'],
				Amount: 0,
				Snackbar: false,
				snackbarAtt: {
					timeout: 6000,
					color: '',
					actions: '',
					message: ''
				}
			}
		},
		mounted () {
			this.getUser()
			this.getVerifiedPayments()
			this.getPurchaseItemList()
		},
		computed: {
			purchaseOrderIdErrors () {
				const errors = []
				if (!this.$v.PurchaseOrderId.$dirty) return errors
				!this.$v.PurchaseOrderId.required && errors.push('Purchase Order is Required')
				return errors
			},
			paymentTypeErrors () {
				const errors = []
				if (!this.$v.PaymentType.$dirty) return errors
					!this.$v.PaymentType.required && errors.push('Payment Method is required')
				return errors
			},
			referenceNumberErrors () {
				const errors = []
				if (!this.$v.ReferenceNo.$dirty) return errors
					!this.$v.ReferenceNo.required && errors.push('Reference Number is required')
				return errors
			},
			amountErrors () {
				const errors = []
				if(!this.$v.Amount.$dirty) return errors
					!this.$v.Amount.required && errors.push('Amount is required')
				return errors
			}
		},
		methods: {
			getUser () {
				this.User = this.$store.getters.getUser
			},
			getVerifiedPayments () {
				axios({
					method: 'get',
					url: 'http://localhost:3002/api/v1/payment',
					params: {
						Filters: 'UserId:/' + User.UserId + '/,Status:/Verified/',
						limit: 1000
					},
					headers: {
						'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
					}
				})
				.then(response => {
					this.VerifiedPaymentList = response.data.items
				})
				.catch(err => {
					
				})
			},
			getPurchaseItemList () {
				this.isLoading = true

				axios({
					method: 'get',
					url: 'http://localhost:3001/api/v1/purchaseorder',
					params: {
						Filters: 'UserId:/' + User.UserId + '/',
						limit: 100
					},
					headers: {
						'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
					}
				})
				.then(response => {
					var items =  response.data.items

					for (let i in items) {
						var PO = items[i]

						var paymentsForPO = this.VerifiedPaymentList.filter(this.VerifiedPaymentList => {return (this.VerifiedPaymentList.PurchaseOrderId === PO._id)})
						var totalAmountPaid = 0
						for (let x in paymentsForPO) {
							totalAmountPaid = Number(totalAmountPaid + paymentsForPO[x].Amount)
						}

						var balance = Number(PO.TotalAmount - totalAmountPaid)

						if (balance > 0) {
							this.PurchaseItemList.push(PO)
						}
					}

					this.isLoading = false
				})
				.catch(err => {
					
				})
			},
			close () {
				this.$emit('closeForm')
			},
			submit () {
				this.isLoading = true

				let payload = {
					PurchaseOrderId = this.PurchaseOrderId,
					ReferenceNo = this.ReferenceNo,
					Amount = this.Amount,
					PaymentType = this.PaymentType,
					UserId = this.User.UserId
				}

				axios({
					method: 'post',
					url: 'http://localhost:3002/api/v1/payment',
					data: paylaod,
					headers: {
						'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
					}
				})
				.then(response => {
					this.isLoading = false
					this.clearForm ()
					this.activateSnackbar('success', response.data.message, 'check')
					this.$emit('closeForm')
					
				})
				.catch(err => {
					this.isLoading = false
					this.activateSnackbar('error', err.response.data.message, 'clear')
				})
			},
			clearForm () {
				this.ReferenceNo = ''
				this.Amount = 0
				this.PaymentType = ''
				this.PurchaseOrderId = ''
			},
			activateSnackbar (color, message, action) {
				this.snackbarAtt.message = message
					this.snackbarAtt.color = color
					this.snackbarAtt.actions = action
					this.Snackbar = !this.Snackbar
			}
		}
	}
</script>