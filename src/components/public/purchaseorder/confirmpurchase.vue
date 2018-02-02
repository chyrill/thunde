<template>
</template>

<script>

export default {
    name: 'confirmPurchase',
    data () {
        return {
            PurchaseOrderNumber: ''
        }    
    },
    mounted () {
        
    },
    computed: {
    },
    methods: {
        getQuotationItem () {
            axios({
                method: 'get',
                url: 'http://localhost:3002/api/v1/quote/' + this.$route.params.id,
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
                }
            })
                .then (response => {
                })
                .catch (err => {
                })
        }
        transformQuotationToPurchase (quotationItem) {
            let payload = {
                CustomerName: quotationItem.Customer.Name,
                CompanyName: quotationItem.Customer.Others.CompanyName,
                TotalAmount: quotationItem.TotalQuote,
                Items: []
            }
    
            for (let item in quotationItem.Items) {
                let data = {
                    Quantity: quotationItem.Items[item].Quantity,
                    TotalAmount: quotationItem.Items[item].TotalAmount,
                    Name: quotationItem.Items[item].Name,
                    UnitPrice: quotationItem.Items[item].UnitPrice,
                    _id: quotationItem.Items[item]._id
                }
                payload.Items.push(data);
            }
        }
    }
}
</script>