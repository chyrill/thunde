<template>
<v-container grid-list-md>
  <v-form>
    <v-layout row wrap>
      <v-flex xs3 v-for="(pics, index ) in Images">
        <img :src="pics" style="width:100px;height:100px" />
        <v-btn icon @click="deleteImage(index)"><v-icon>close</v-icon></v-btn>
      </v-flex>
      <input type="file" id="picUpload" name="picture" hidden @change="uploadImage" />
      <v-flex xs10 offset-xs1>
        <v-btn dark color="accent" @click="tickUpload">Upload Image
          <v-icon right>add_a_photo</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs10 offset-xs1>
        <v-text-field label="Product Name" required v-model="Name" :error-messages="nameErrors" @blur="$v.Name.$touch()" @input="$v.Name.$touch()" />
      </v-flex>
      <v-flex xs10 offset-xs1>
        <v-text-field label="SKU" required v-model="SKU" :error-messages="skuErrors" @blur="$v.SKU.$touch()" @input="$v.SKU.$touch()" />
      </v-flex>
      <v-flex xs10 offset-xs1>
        <v-text-field multi-line label="Description" required v-model="Description" :error-messages="descriptionErrors" @blur="$v.Description.$touch()" @input="$v.Description.$touch()" />
      </v-flex>
      <v-flex xs10 offset-xs1>
        <v-text-field multi-line label="Features" v-model="Features" />
      </v-flex>
      <v-flex xs10 offset-xs1>
        <v-layout row wrap>
          <v-flex xs6>
            <v-select label="Category" v-bind:items="categories" required :error-messages="categoryErrors" @blur="$v.Category.$touch()" @input="$v.Category.$touch()" v-model="Category"> </v-select>
          </v-flex>
          <v-flex xs6>
            <v-select label="Product Type" v-bind:items="productTypes" v-model="ProductType" required :error-messages="productTypesErrors" @blur="$v.ProductType.$touch()" @input="$v.ProductType.$touch()"> </v-select>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs10 offset-xs1>
        <v-layout row wrap>
          <v-flex xs4>
            <v-select label="Currency" v-bind:items="currencies" v-model="Currency"> </v-select>
          </v-flex>
          <v-flex xs8>
            <v-text-field label="Amount" v-model="Amount" required :error-messages="amountErrors" @blur="$v.Amount.$touch()" @input="$v.Amount.$touch()"/>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-layout row wrap v-if="ProductType === 'Imported Goods'">
      <v-flex xs12>
      <v-divider></v-divider>
    </v-flex>
    <v-flex xs12>
      <span style="color:#0091EA"><h2>Supplier Information</h2></span>
    </v-flex>
      <v-flex xs10 offset-xs1>
        <v-text-field label="Supplier Name"  required v-model="SupplierName" :error-messages="supplierNameErrors" @blur="$v.SupplierName.$touch()" @input="$v.SupplierName.$touch()"/>
      </v-flex>
      <v-flex xs10 offset-xs1>
        <v-text-field multi-line label="Address" v-model="SupplierAddress" :error-messages="supplierAddressErrors" @blur="$v.SupplierAddress.$touch()" @input="$v.SupplierAddress.$touch()" />
      </v-flex>
      <v-flex xs10 offset-xs1>
        <v-layout row wrap>
          <v-flex xs6>
            <v-text-field label="Contact Number" v-model="SupplierContactNumber" />
          </v-flex>
          <v-flex xs6>
            <v-text-field label="Email Address" required v-model="SupplierEmail" :error-messages="supplierEmailErrors" @input="$v.SupplierEmail.$touch()" @blur="$v.SupplierEmail.$touch()" />
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    </v-layout>
  </v-form>
  <v-snackbar :timeout="snackbar.timeout" color="red" :top="snackbar.top" :multi-line="snackbar.multi" :vertical="snackbar.vertical" v-model="Snackbar"> {{Errors}} </v-snackbar>
</v-container>
</template>



<script>
import axios from 'axios'
import {
  validationMixin
} from 'vuelidate'

import {
  required,
  minLength,
  email
} from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  validations: {
    Name: {
      required,
      minLength: minLength(3)
    },
    Description: {
      required,
      minLength: minLength(6)
    },
    SKU: {
      required
    },
    ProductType: {
      required
    },
    Amount: {
      required
    },
    SupplierName: {
      required
    },
    SupplierAddress: {
      required
    },
    Category: {
      required
    },
    SupplierEmail: {
      required,
      email
    }
  },
  props: ['clearData','id'],
  name: 'ProductForm',
  data () {
    return {
      _id: '',
      currencies: [],
      productTypes: ['Imported Goods'],
      categories: [],
      Name: '',
      Description: '',
      Features: '',
      SKU: '',
      SupplierName: '',
      SupplierAddress: '',
      SupplierContactNumber: '',
      SupplierEmail: '',
      ProductType: '',
      Category: '',
      Amount: '',
      Currency: '',
      Snackbar: false,
      snackbar :{
        timeout: 6000,
        top: true,
        multi: true,
        vertical: true
      },
      Errors: '',
      Images: [],
      IsValid: false,
      Data: {
        Name: '',
        Images: '',
        Description: '',
        Features: '',
        Category: '',
        ProductType: '',
        SKU: ''
      },
      OtherInformation: {
        SupplierName: '',
        SupplierAddress: '',
        SupplierContactNumber: '',
        SupplierEmail: ''
      },
      Price: {
        Currency: '',
        Amount: ''
      }
    }
  },
  mounted () {
    axios({
      method: 'get',
      url: 'http://localhost:3001/api/v1/category',
      params: {
        Context : localStorage.getItem('Context')
      }
    })
      .then(response =>{
        var categoryItem = response.data.items
        for (let i in categoryItem) {
          this.categories.push(categoryItem[i].Name)
        }
      })
    axios({
      method: 'get',
      url: 'https://api.fixer.io/latest'
    })
      .then(response =>{
        var rates = response.data.rates
        for (let i in rates) {
          this.currencies.push(i)
        }
      })
  },
  methods: {
    tickUpload () {
      if (this.Images.length >= 4) {
        this.Snackbar = true
        this.Errors = 'You can only add 4 Product Images'
      }
      else {
          document.getElementById('picUpload').click()
      }
    },
    uploadImage (e) {
      var data = e.target.files || e.dataTransfer.files
      var filename = data[0].name
      var split = filename.split('.')
      var extname = split[split.length - 1]
      var imageList = ['png', 'jpeg', 'jpg']
      var letmesee = imageList.indexOf(extname)
      if (letmesee < 0) {
        document.getElementById('picUpload').value = ''
        this.Snackbar = true
        this.Errors = 'You can only upload an image file'
      } else {
        const formData = new FormData()
        formData.set('uploaddata', data[0])
        axios.post('http://localhost:4000/api/v1/upload', formData)
          .then(response => {
            this.Images.push(response.data.model)
          })
          .catch(err => {

          })
      }
    },
    deleteImage (index) {
      this.Images.splice(index,1)
    }
  },
  computed: {
    nameErrors () {
      const errors = []
      if (!this.$v.Name.$dirty) return errors
      !this.$v.Name.required && errors.push('Name is required')
      !this.$v.Name.minLength && errors.push('Minimum length of 3')
      return errors
    },
    skuErrors () {
      const errors = []
      if (!this.$v.SKU.$dirty) return errors
      !this.$v.SKU.required && errors.push('Name is required')
      return errors
    },
    descriptionErrors () {
      const errors = []
      if (!this.$v.Description.$dirty) return errors
      !this.$v.Description.required && errors.push('Description is required')
      !this.$v.Description.minLength && errors.push('Minimum length of 6')
      return errors
    },
    categoryErrors () {
      const errors = []
      if (!this.$v.Category.$dirty) return errors
      !this.$v.Category.required && errors.push('Category is required')
      return errors
    },
    productTypesErrors () {
      const errors = []
      if (!this.$v.ProductType.$dirty) return errors
      !this.$v.ProductType.required && errors.push('ProductType is required')
      return errors
    },
    amountErrors () {
      const errors = []
      if (!this.$v.Amount.$dirty) return errors
      !this.$v.Amount.required && errors.push('Amount is required')
      return errors
    },
    supplierNameErrors () {
      const errors = []
      if (!this.$v.SupplierName.$dirty) return errors
      !this.$v.SupplierName.required && errors.push('Supplier Name is required')
      return errors
    },
    supplierAddressErrors () {
      const errors = []
      if (!this.$v.SupplierAddress.$dirty) return errors
      !this.$v.SupplierAddress.required && errors.push('Supplier Address is required')
      return errors
    },
    supplierEmailErrors () {
      const errors = []
      if (!this.$v.SupplierEmail.$dirty) return errors
      !this.$v.SupplierEmail.required && errors.push('Supplier Address is required')
      !this.$v.SupplierEmail.email && errors.push('Invalid Email Address')
      return errors
    },
    validForm () {
      return this.$v.$invalid
    },
    clearForm () {
      return this.clearData
    },
    IdToEdit () {
      return this.id
    }
  },
  watch: {
    validForm (value) {
      console.log(value)
      if (value) {

          this.$emit('isValid',false)
      }
      else {
          for (let i in this.Data) {
            this.Data[i] = this[i]
          }
          for (let i in this.OtherInformation) {
            this.OtherInformation[i] = this[i]
          }
          for (let i in this.Price) {
            this.Price[i] = this[i]
          }
          this.Data['OtherInformation'] = this.OtherInformation
          this.Data['Price'] = this.Price
          if (this._id !== null || this._id !== undefined) {
            this.Data['_id'] = this._id
          }
          this.$emit('isValid',true)
          this.$emit('dataEmit',this.Data)
      }
    },
    IdToEdit (value) {
      if (value !== null || value !== undefined) {
        axios({
          method: 'get',
          url: 'http://localhost:3001/api/v1/products/' + value,
          headers: {
            'Authorization': 'Bearer ' + this.$store.getters.getAuthCode
          }
        })
          .then(response =>{
            var modelItem = response.data.model
            for (let prop in modelItem) {
              this[prop] = modelItem[prop]
            }
            for (let prop in modelItem.OtherInformation) {
              this[prop] = modelItem.OtherInformation[prop]
            }
            for (let prop in modelItem.Price) {
              this[prop] = modelItem.Price[prop]
            }
          })
      }
    },
    clearForm (value) {
      console.log('hey shit')
      this.Name= ''
      this.Description= ''
      this.Features= ''
      this.SKU= ''
      this.SupplierName= ''
      this.SupplierAddress= ''
      this.SupplierContactNumber= ''
      this.SupplierEmail= ''
      this.ProductType= ''
      this.Category= ''
      this.Amount= ''
      this.Currency= ''
      this.Images= []
    }
  }
}
</script>
