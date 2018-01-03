import jwt from 'jsonwebtoken'

export function jwtDecode (token) {
  var userdata = jwt.verify(token, 'blaiseSecretKey')
  this.$store.commit('setUser',userdata.user)
}
