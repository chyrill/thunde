<template>
	<v-card>
		<v-toolbar color="primary" dark>
			<v-toolbar-title>Add Payment</v-toolbar-title>
		</v-toolbar>
		<v-progress-linear :indeterminate="true" v-if="isLoading" color="success"></v-progress-linear>
		<v-card-text>
			<v-layout row wrap>
				<v-flex xs10 offset-xs1>
					<v-select label="Customer Name" :items="Users" item-value="Id" v-model="UserId" item-text="Name" :error-messages="userIdErrors" @blur="$v.UserId.$touch()" @input="getPurchaseOrders" autocomplete/>
				</v-flex>
				<v-flex xs10 offset-xs1>
					<v-select label="Purchase Order Number" item-value="_id" @blur="$v.PurchaseOrderId.$touch()"  :items="PurchaseOrderList" item-text="PurchaseOrderNo" v-model="PurchaseOrderId" :error-messages="purchaseorderErrors"/>
				</v-flex>
				<v-flex xs10 offset-xs1>
					<v-select label="PaymentMethod" :items="PaymentMethods" @blur="$v.PaymentType.$touch()" v-model="PaymentType" :error-messages="paymentmethodErrors"/>
				</v-flex>
				<v-flex xs10 offset-xs1>
					<v-text-field label="Reference Number" v-model="ReferenceNo" @blur="$v.ReferenceNo.$touch()" @input="$v.ReferenceNo.$touch()" :error-messages="referenceErrors"/>
				</v-flex>
				<v-flex xs4 offset-xs7 offset-xs1>
					<v-text-field label="Amount" v-model="Amount" :error-messages="amountErrors" @blur="$v.Amount.$touch()" @input="$v.Amount.$touch()"/>
				</v-flex>
			</v-layout>
		</v-card-text>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn flat color="primary" :disabled="isLoading || $v.$invalid" @click="submitPayment">submit</v-btn>
			<v-btn flat color="error" :disabled="isLoading" @click="closeDialog">close</v-btn>
		</v-card-actions>
		<v-snackbar :timeout="snackbar.Timeout" :color="snackbar.Color" top v-model="Snackbar">
		    {{ snackbar.Message }}
		    <v-btn flat dark @click="Snackbar = !Snackbar">{{snackbar.Actions}}</v-btn>
		</v-snackbar>
	</v-card>
</template>


<script>
import axios from 'axios'
import { productUrl, transactionUrl, userUrl } from '../../../helpers/apiurl'
import {
  validationMixin
} from 'vuelidate'

import {
  required,
  minLength,
  email,
  sameAs
} from 'vuelidate/lib/validators'

export default {
	name: 'addPayment',
	mixins: [validationMixin],
	validations: {
		PaymentType: {
			required
		},
		PurchaseOrderId: {
			required
		},
		UserId: {
			required
		}
	},
	data () {
		return {
			PurchaseOrderList: [],
			PaymentMethods: ['Cash', 'Bank Deposit - BPI', 'Bank Deposit - BDO', 'Bank Deposit - Robinsons', 'Bank Deposit - Metrobank', 'Bank Deposit - Others'],
			isLoading: false,
			UserInfo: {},
			PaymentType: '',
			ReferenceNo: '',
			Amount: 0,
			PurchaseOrderId: '',
			snackbar: {
				Timeout: 6000,
				Color: '',
				Message: '',
				Actions: ''
			},
			Snackbar: false,
			UserId: '',
			Users: []
		}
	},
	mounted () {
		this.UserInfo = this.$store.getters.getUser
		this.getAllUser()
	},
	methods: {
		getAllUser () {
			axios({
				method: 'get',
				url: userUrl + '/api/v1/userInfo/all',
				params: {
					Context: localStorage.getItem('Context')
				},
				headers: {
					'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
				}
			})
			.then(response => {
				var items = response.data.items

				for (let item in items) {
					let user = {
						Name: items[item].LastName + ', ' + items[item].FirstName,
						Id: items[item]._id
					}

					this.Users.push(user)
				}
			})
			.catch(err => {
				
			})
		},
		getPurchaseOrders () {
			axios({
				method: 'get',
				url: productUrl + '/api/v1/purchaseorder/all/' + this.UserId,
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
		submitPayment () {
			this.isLoading = !this.isLoading

			let payload = {
				PaymentType: this.PaymentType,
				ReferenceNo: this.ReferenceNo,
				Amount: this.Amount,
				UserId: this.UserId,
				PurchaseOrderId: this.PurchaseOrderId
			}

			axios({
				method: 'post',
				url: transactionUrl + '/api/v1/payment',
				data: payload,
				headers: {
					'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
				}
			})
			.then(response => {
				this.activateSnackBar('check', response.data.message, 'success')
				this.isLoading = !this.isLoading
				this.closeDialog()
			})
			.catch(err => {
				this.activateSnackBar('clear', err.response.data.message, 'error')
				this.isLoading = !this.isLoading
			})
		},
		activateSnackBar(action, message, color) {
			this.snackbar.Actions = action
			this.snackbar.Message = message
			this.snackbar.Color = color
			this.Snackbar = !this.Snackbar
		},
		closeDialog () {
			this.PaymentType = ''
			this.PurchaseOrderId = ''
			this.Amount = 0
			this.ReferenceNo = ''
			this.$emit('close')
		}
	},
	computed: {
		User () {
			return this.$store.getters.getUser
		},
		purchaseorderErrors () {
			const errors = []
			if(!this.$v.PurchaseOrderId.$dirty) return errors
			!this.$v.PurchaseOrderId.required && errors.push('Purchase Order must not be null')
			return errors
		},
		amountErrorso () {
			const errors = []
			if(!this.$v.Amount.$dirty) return errors
			!this.$v.Amount.required && errors.push('Amount must not be null')
			return errors
		},
		paymentmethodErrors () {
			const errors = []
			if(!this.$v.PaymentType.$dirty) return errors
			!this.$v.PaymentType.required && errors.push('Payment method must not be null')
			return errors
		},
		userIdErrors () {
			const errors = []
			if(!this.$v.UserId.$dirty) return errors
			!this.$v.UserId.required && errors.push('User is required')
			return errors
		}
	}
}
</script>