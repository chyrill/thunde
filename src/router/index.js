import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import SignUp from '@/components/User/SignUp'
import SignIn from '@/components/User/SignIn'
import Products from '@/components/ProductsManagement/Products'
import ProductListing from '@/components/public/products/Products'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp,
      meta: {
        forVisitor: true
      }
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn,
      meta: {
        forVisitor: true
      }
    },
    {
      path: '/admin/product',
      name: 'Product',
      component: Products,
      meta: {
        forAdmin: true
      }
    },
    {
      path: '/Products',
      name: 'ProductList',
      component: ProductListing
    }
  ],
  mode: 'history'
})
