export default function ({ store, redirect }) {
  const isAccountActive = store.getters['accounts/isAccountActive']
  if (!isAccountActive) {
    redirect('/connect')
  }
}
