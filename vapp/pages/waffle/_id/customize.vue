<template>
  <v-container>
    <v-col v-if="!loading" class="pa-0 ma-0">
      <v-row class="vh-center waffle-text-border waffle-time-label">
        It's Waffle Time!
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="wafflemaker-container" color="#000000AA" tile>
            <v-card-title class="vh-center wafflemaker-title waffle-text">
              Wafflemaker 9000
            </v-card-title>
            <v-card-text>
              <v-row>
                <waffle-display :waffle="modifiedViewedWaffle" />
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-row>
            <v-col cols="6" md="4" order="1">
              <select-field v-model="baseId" title="Base" :list="baseList" />
            </v-col>
            <v-col cols="6" md="4" order="2">
              <select-field v-model="toppingId" title="Topping" :list="toppingList" />
            </v-col>
            <v-col cols="6" md="4" order="3">
              <select-field v-model="toppingId" title="Extra" :list="toppingList" />
            </v-col>
            <v-col cols="12" md="8" order="5" order-md="4">
              <v-text-field outlined />
              <v-textarea outlined />
            </v-col>
            <v-col cols="6" md="4" order="4" order-md="5">
              <select-field v-model="plateId" title="Plate" :list="plateList" />
            </v-col>
          </v-row>
          <v-row class="vh-center">
            <v-btn outlined @click="customizeWaffleLayer">
              Confirm
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import Waffle from '~/database/Waffle'
import WaffleDisplay from '~/components/WaffleDisplay.vue'
import baseList from '~/lists/waffle-bases'
import toppingList from '~/lists/waffle-toppings'
import plateList from '~/lists/waffle-plates'
import SelectField from '~/components/inputs/SelectField.vue'

export default {
  name: 'Customize',
  components: { SelectField, WaffleDisplay },
  data () {
    return {
      loading: true,
      error: '',

      viewedWaffle: null,
      baseId: 0,
      toppingId: 0,
      extraId: 0,
      plateId: 0
    }
  },
  computed: {
    viewedWaffleId () {
      return this.$route.params.id
    },
    modifiedViewedWaffle () {
      const newWaffle = this.viewedWaffle
      newWaffle.layers[newWaffle.layers.length - 1].baseId = this.baseId
      newWaffle.layers[newWaffle.layers.length - 1].toppingId = this.toppingId
      newWaffle.plateId = this.plateId
      return newWaffle
    },

    base () {
      return baseList[this.baseId]
    },
    topping () {
      return toppingList[this.toppingId]
    },
    extra () {
      return WaffleBaseType[this.baseId]
    },
    plate () {
      return plateList[this.plateId]
    },

    baseList () {
      return baseList
    },
    toppingList () {
      return toppingList
    },
    extraList () {
      return baseList
    },
    plateList () {
      return plateList
    }
  },
  async mounted () {
    if (this.viewedWaffleId != null) {
      await Waffle.dispatch('setupCachedCalls', [this.viewedWaffleId])
      this.viewedWaffle = Waffle.getters('getWafflebyId')(this.viewedWaffleId)

      this.loading = false
    }
  },
  methods: {
    customizeWaffleLayer () {
      Waffle.dispatch('customizeWaffleLayer', {
        waffleId: this.viewedWaffleId,
        baseId: this.baseId,
        toppingId: this.toppingId,
        extraId: this.extraId,
        plateId: this.plateId
      })
    }
  }
}
</script>

<style scoped>
.waffle-time-label {
  font-size: 65px;
  margin-bottom: 50px;
}

.wafflemaker-container {
  border: 5px white solid !important;
}

.wafflemaker-title {
  font-size: 45px;
  background-color: #3d3d3d;
  padding: 25px;
}
</style>
