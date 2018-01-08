<template>
<v-app>
  <v-navigation-drawer  v-if="IsAdminPage" absolute temporary v-model="sideNav">
    <v-toolbar flat class="transparent">
      <v-list class="pa-0">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img :src="User.ProfilePicture" />
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{User.Name}}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon @click.native.stop="mini = !mini">
              <v-icon>chevron_left</v-icon>
            </v-btn>
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
  <v-toolbar  dark color="primary">
    <v-toolbar-title>Brand</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items  color="primary" v-if="!IsAdminPage" class="hidden-md-and-down">
      <v-btn  dark color="primary" to="/Products">
        <v-icon left>list</v-icon> Products
      </v-btn >
      <v-btn  color="primary">
        <v-icon left>shopping_cart</v-icon> Cart
      </v-btn>
      <v-menu offset-y :offset-overflow="true" :close-on-content-click="false" :nudge-width="200" v-model="menu">
        <v-btn   slot="activator"  color="primary">
          <v-icon left>account_box</v-icon> Account</v-btn>
        <v-card>
          <v-list>
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <div v-if="IsAuthenticated">
                  <img :src="User.ProfilePicture" />
                </div>
                <div v-else>
                  <v-icon>account_circle</v-icon>
                </div>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <div v-if="IsAuthenticated">
                  <v-list-tile-title>{{User.Name}}</v-list-tile-title>
                  <v-list-tile-sub-title>{{User.Others.PhoneNumber}}</v-list-tile-sub-title>
                </div>
                <div v-else>
                  <v-list-tile-title>Guest</v-list-tile-title>
                  <v-list-tile-sub-title>No Contact Number</v-list-tile-sub-title>
                </div>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn icon :class="IsAuthenticated? 'red--text':''">
                  <v-icon>vpn_key</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          <v-divider></v-divider>
          <v-list>
            <div v-if="!IsAuthenticated">
              <v-list-tile avatar to="/signup">
                <v-list-tile-avatar>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>Sign Up</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn icon>
                    <v-icon>person_add</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <v-list-tile avatar to="/signin">
                <v-list-tile-avatar>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>Log In</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn icon>
                    <v-icon>lock_open</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </div>
            <div v-else>
              <v-list-tile avatar @click="Logout">
                <v-list-tile-avatar>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>Log out</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn icon>
                    <v-icon>reply</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </div>
          </v-list>
        </v-card>
      </v-menu>
    </v-toolbar-items>
    <v-toolbar-side-icon v-if="!IsAdminPage" class="hidden-md-and-up" @click.stop="sideNav=!sideNav">
    </v-toolbar-side-icon>
    <v-toolbar-side-icon v-if="IsAdminPage"  @click.stop="sideNav=!sideNav">
    </v-toolbar-side-icon>
  </v-toolbar>
  <main>
    <router-view/>
  </main>
</v-app>
</template>
<script>
export default {
  name: 'app',
  data() {
    return {
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
          }
        ]
    }
  },
  computed: {
    User () {
      return this.$store.getters.getUser
    }
  },
  mounted () {
    if (localStorage.getItem('Token')) {
      this.$store.dispatch('jwtdecode', localStorage.getItem('Token'))
    }
  },
  watch: {
    User (value) {
      if (value.Name !== null && value.Name !== undefined) {
        this.IsAuthenticated = true

        if (value.AccessLevel !== 4) {
          this.IsAdminPage = true
        }
      }
    }
  },
  methods: {
    Logout () {
      this.$store.dispatch('logout')
      localStorage.removeItem('Token')
      localStorage.removeItem('AuthCode')
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
