<template>
    <v-app>
        <v-toolbar absolute clipped-left app>
            <v-toolbar-title>Brand</v-toolbar-title>
            <v-spacer></v-spacer>
            <template v-if="!IsAdminPage">
                <v-btn flat to="/quotations"><v-icon left>receipt</v-icon>Quotations</v-btn>
                <v-btn flat to="/Products"><v-icon left>list</v-icon>Products</v-btn>
                <v-menu offset-y :offset-overflow="true" :close-on-content-click="false" :nudge-width="250" v-model="menu2">
                  <v-btn slot="activator" flat>
                    <v-badge color="error" left v-if="ShoppingCart.Items.length>0"> <span slot="badge">{{ShoppingCart.Items.length}}</span>
                    <v-icon left>shopping_cart</v-icon> </v-badge>  <v-icon left v-if="ShoppingCart.Items.length<=0">shopping_cart</v-icon> Cart
                  </v-btn>
                    <v-card>
                        <v-list two-line>
                          <template v-for = "item in ShoppingCart.Items">
                            <v-list-tile avatar>
                              <v-list-tile-avatar>
                                <img :src="item.Images[0]"/>
                              </v-list-tile-avatar>
                              <v-list-tile-content>
                                <v-list-tile-title v-html="item.Name"></v-list-tile-title>
                                <v-list-tile-sub-title v-html="item.SKU"></v-list-tile-sub-title>
                              </v-list-tile-content>
                              <v-list-tile-action>
                                  <v-list-tile-action-text>
                                       {{item.Quantity}} items
                                  </v-list-tile-action-text>
                                  <v-btn icon flat @click="removeShoppingCart(item._id)"><v-icon>remove</v-icon></v-btn>
                              </v-list-tile-action>
                            </v-list-tile>
                            <v-divider></v-divider>
                          </template>
                        </v-list>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                       <v-btn flat color="primary" :disabled="!IsAuthenticated" v-if="ShoppingCart.Items.length>0" @click="requestQuotation">Request a Quote</v-btn>
                      <v-btn flat color="orange" to="/ShoppingCart">Explore</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
                <template v-if="!IsAuthenticated">
                    <v-menu offset-y :offset-overflow="true" :close-on-content-click="false" :nudge-width="250" v-model="menu">
                        <v-btn slot="activator" flat><v-icon left>account_box</v-icon>Account</v-btn>
                        <v-card>
                            <v-list>
                                <v-list-tile to="/transactions">
                                    <v-list-tile-content>
                                        <v-list-tile-title>My Transactions</v-list-tile-title>
                                    </v-list-tile-content>
                                    <v-list-tile-action><v-icon>credit_card</v-icon></v-list-tile-action>
                                </v-list-tile>
                                <v-divider></v-divider>
                                <v-list-tile to="/signup">
                                    <v-list-tile-content>
                                         <v-list-tile-title>Sign Up</v-list-tile-title>
                                    </v-list-tile-content>
                                    <v-list-tile-action><v-icon>person_add</v-icon></v-list-tile-action>
                                </v-list-tile>
                                <v-divider></v-divider>
                                <v-list-tile to="/signin">
                                    <v-list-tile-content>
                                        <v-list-tile-title>Sign In</v-list-tile-title>
                                    </v-list-tile-content>
                                    <v-list-tile-action><v-icon>input</v-icon></v-list-tile-action>
                                </v-list-tile>
                            </v-list>
                        </v-card>
                    </v-menu>
                </template>
                <template v-if="IsAuthenticated">
                    <template v-if="!IsAdminPage">
                         <v-menu offset-y :offset-overflow="true" :close-on-content-click="false" :nudge-width="250" v-model="menu">
                            <v-btn slot="activator" flat><v-icon left>account_box</v-icon>Account</v-btn>
                            <v-card>
                                <v-list>
                                    <v-list-tile to="/transactions">
                                        <v-list-tile-content>
                                            <v-list-tile-title>My Transactions</v-list-tile-title>
                                        </v-list-tile-content>
                                        <v-list-tile-action><v-icon>credit_card</v-icon></v-list-tile-action>
                                    </v-list-tile>
                                    <v-divider></v-divider>
                                    <v-list-tile to="/signup">
                                        <v-list-tile-content>
                                             <v-list-tile-title>Sign Up</v-list-tile-title>
                                        </v-list-tile-content>
                                        <v-list-tile-action><v-icon>person_add</v-icon></v-list-tile-action>
                                    </v-list-tile>
                                    <v-divider></v-divider>
                                    <v-list-tile to="/signin">
                                        <v-list-tile-content>
                                            <v-list-tile-title>Sign In</v-list-tile-title>
                                        </v-list-tile-content>
                                        <v-list-tile-action><v-icon>input</v-icon></v-list-tile-action>
                                    </v-list-tile>
                                </v-list>
                            </v-card>
                        </v-menu>
                    </template>
                </template>
            </template>
            <template v-if="IsAdminPage">
                    <v-btn flat icon disabled> 
                        <v-avatar size="40px">
                            <img :src="User.ProfileImage" />
                        </v-avatar>
                    </v-btn>
                    <v-btn flat>   
                        {{User.Name}}
                    </v-btn>
                </template>
        </v-toolbar>
        <v-navigation-drawer v-if="IsAdminPage" fixed clipped app :mini-variant.sync="mini">
            <v-toolbar flat class="transparent">
                <v-list>
                    <v-list-tile avatar>
                        <v-list-tile-avatar>
                            <img :src="User.ProfileImage" />
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title>{{User.Name}}</v-list-tile-title>
                            <v-list-tile-sub-title><span v-html="User.AccessLevel===1?'Administrator':'Sales'"></span></v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-btn icon @click.native.stop="mini = !mini"><v-icon>chevron_left</v-icon></v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>
            </v-toolbar>
            <v-divider></v-divider>
            <v-list-group v-for="item in items" :value="item.active" v-bind:key="item.title">
              <v-list-tile slot="item" @click="item.active = !item.active">
                <v-list-tile-action>
                  <v-icon>{{ item.action }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon>keyboard_arrow_down</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-list-tile v-for="subItem in item.items" v-bind:key="subItem.title" :to="subItem.href" @click.native="sideNav=!sideNav">
                <v-list-tile-content>
                  <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon>{{ subItem.action }}</v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </v-list-group>
        </v-navigation-drawer>
        <v-content>
            <main>
                <router-view/>
            </main>
        </v-content>
    </v-app>
</template>
<script>
import Uuid from 'uuid-lib'
import axios from 'axios'

export default {
  name: 'app',
  data() {
    return {
      quotations: [],
      menu2: false,
      sideNav: false,
      menu: false,
      IsAuthenticated: false,
      IsAdminPage: false,
      mini: true,
      items: [
          {
            action: 'loyalty',
            title: 'Product Management',
            active: false,
            items: [
              { title: 'Products', href: '/admin/product', action: 'list' }
            ]
          },
          {
            action: 'credit_card',
            title: 'Transaction Management',
            active: false,
            items: [
              { title: 'Quotation', href: '/admin/quotation', action: 'attach_money' }
            ]
          }
        ]
    }
  },
  computed: {
    User () {
      return this.$store.getters.getUser
    },
    ShoppingCart () {
      return this.$store.getters.getShoppingCart
    }
  },
  mounted () {
    if (localStorage.getItem('Token')) {
      this.$store.dispatch('jwtdecode', localStorage.getItem('Token'))
    }
    localStorage.setItem('Context','5a43354f1a070f28107f806a')
    this.$store.dispatch('setDefaultUser')
    this.$store.dispatch('setShoppinCart')
    this.getQuotationByUser()
  },
  watch: {
    User (value) {
      if (value.AuthCode != null && value.AuthCode != undefined) {
        this.IsAuthenticated = true

        if (value.AccessLevel != 4) {
          this.IsAdminPage = true
        }
      }
      else {
        this.IsAuthenticated = false
      }
    }
  },
  methods: {
    Logout () {
      this.$store.dispatch('logout')
      localStorage.removeItem('Token')
      localStorage.removeItem('AuthCode')
      localStorage.removeItem('forAdmin')
      this.$router.push('/signin')
      this.IsAdminPage =false
    },
    removeShoppingCart (value) {
      this.$store.dispatch('removeItemInCart',value)
    },
    requestQuotation () {
      this.$store.dispatch('requestForQoutation')
    },
    getQuotationByUser () {
      axios({
        method: 'get',
        url: 'http://ed132795.ngrok.io/api/v1/quotation/quote/' + this.$store.getters.getShoppingCart.UserId,
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
        }
      })
        .then(response=>{
          this.quotations = response.data.items
        })
    }
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
    list-style: none;
}
</style>
