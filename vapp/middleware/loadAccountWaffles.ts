import Waffle from '~/database/Waffle'

export default async ({ store }) => {
  const accountOwnedWaffleIds = store.getters['accounts/getOwnedWaffleIds']
  await Waffle.dispatch('setupCachedCalls', accountOwnedWaffleIds)
}
