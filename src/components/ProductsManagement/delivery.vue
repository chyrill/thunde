<template>
	<v-container>
		<v-card>
			<v-toolbar color="primary" dark>
				<v-toolbar-title>Delivery</v-toolbar-title>
				<v-btn color="error" dark fab absolute right bottom @click="addDeliveryDialog=!addDeliveryDialog"><v-icon>add</v-icon></v-btn>
			</v-toolbar>
			<v-card-text>
				<v-data-table hide-actions v-bind:headers="deliveryHeaders" :items="deliveryList" class="elevation-1">
				</v-data-table>
			</v-card-text>
		</v-card>
		<!-- delivery form -->
		<v-dialog v-model="addDeliveryDialog" max-width="900">
			<DeliveryForm/>
		</v-dialog>
		<!-- end -->
	</v-container>
</template>


<script>
	import axios from 'axios'
	import DeliveryForm from './Forms/deliveryform'
	export default {
		name: 'delivery',
		data () {
			return {
				deliveryHeaders: [
				],
				deliveryList: [],
				addDeliveryDialog: false
			}
		},
		mounted () {

		},
		computed: {

		},
		methods: {
		
		},
		components: {
			DeliveryForm
		}
	}
</script>