<template>
<v-app>
  <v-toolbar dark color="primary">
    <v-toolbar-title>Brand</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-md-and-down">
      <v-btn>
        <v-icon left>list</v-icon> Products
      </v-btn>
      <v-btn>
        <v-icon left>shopping_cart</v-icon> Cart
      </v-btn>
      <v-menu offset-y :offset-overflow="true" :close-on-content-click="true" :nudge-width="200" v-model="menu">
        <v-btn slot="activator">
          <v-icon left>account_box</v-icon> Account</v-btn>
        <v-card>
          <v-list>
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <v-icon>account_circle</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{FullName}}</v-list-tile-title>
                <v-list-tile-sub-title>{{ContactNumber}}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn icon :class="LogIn? 'red--text':''">
                  <v-icon>vpn_key</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          <v-divider></v-divider>
          <v-list>
            <v-list-tile avatar href="/signup">
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
            <v-list-tile avatar>
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
          </v-list>
        </v-card>
      </v-menu>
    </v-toolbar-items>
    <v-toolbar-side-icon class="hidden-md-and-up" @click.stop="sideNav=!sideNav">
    </v-toolbar-side-icon>
  </v-toolbar>
  <v-navigation-drawer v-model="sideNav" absolute temporary>

  </v-navigation-drawer>
  <main>
    <router-view/>
  </main>
</v-app>
</template>
<script>
export default {
  name: 'app',
  data () {
    return {
      sideNav: false,
      menu: false,
      FullName: 'Guest',
      ContactNumber: 'sadsadasewqewqewq213',
      LogIn: false
    }
  }
}
</script>

<style>
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }
</style>
