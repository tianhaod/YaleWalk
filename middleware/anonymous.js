import firebase from 'firebase/app'

export default ({isServer, store, redirect}) => {
  if (!isServer && (store.getters.isAuthenticated)) {
    return redirect('/user/profile')
  }
}
