<template>
  <v-card width="100%" min-height="175px" class="vh-center waffle-container mx-5 mt-5">
    <v-card v-if="waffle.hasOngoingProcess(now)" width="100%" height="100%" class="vh-center waffle-overlay waffle-text" color="#000000EE">
      <div class="fill-width">
        <v-row>
          <v-col cols="12" md="8">
            <v-row class="vh-center mb-5">
              <h2>
                Currently Baking...
              </h2>
            </v-row>
            <v-row class="vh-center">
              Status: {{ waffle.statusLabel(now) }}
            </v-row>
            <v-row class="vh-center">
              <countdown-timer :end-timestamp="waffle.processEnd" />
            </v-row>
          </v-col>
          <v-col cols="12" md="4" class="px-5 vh-center">
            <v-btn class="add-ingredient-button" :disabled="!waffle.isActionRequired(now)" width="100%" height="125" @click="advanceWaffleCustomizationStep(waffle.id)">
              <v-col>
                <v-row class="vh-center waffle-text mb-5">
                  <h1>
                    Add Ingredient
                  </h1>
                </v-row>
                <template v-if="waffle.isActionRequired(now)">
                  <v-row class="vh-center">
                    Time Remaining:
                  </v-row>
                  <v-row class="vh-center">
                    <countdown-timer :end-timestamp="waffle.customizationWindowEnd" />
                  </v-row>
                </template>
                <template v-else>
                  <v-row class="vh-center">
                    Next Ingredient In:
                  </v-row>
                  <v-row class="vh-center">
                    <countdown-timer :end-timestamp="waffle.customizationWindowStart" />
                  </v-row>
                </template>
              </v-col>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-card>
    <v-row class="vh-center">
      <v-col class="mt-5 vh-center" cols="12" md="4" order="2" order-md="1">
        <waffle-display :width="175" :waffle="waffle" />
      </v-col>
      <v-col cols="12" md="5" order="1" order-md="2">
        <v-row class="vh-center waffle-text-border-black">
          <h2>
            {{ waffle.name }}
          </h2>
        </v-row>
        <v-row class="px-5">
          <v-col cols="6">
            <v-row class="vh-center">
              Layers: {{ waffle.layers.length }}
            </v-row>
          </v-col>
          <v-col cols="6">
            <v-row class="vh-center">
              Price: ${{ waffle.price }}
            </v-row>
          </v-col>
        </v-row>
        <v-row v-if="waffle.status(now) !== WaffleStatus.Burned && !waffle.published" class="px-5">
          <v-col cols="6" class="ma-0 pa-0">
            <v-tooltip top transition="fade-transition">
              <template v-slot:activator="{ on }">
                <v-card
                  :to="`/waffles/${waffle.id}/customize`"
                  width="100%"
                  height="65"
                  flat
                  class="vh-center waffle-text option-button left"
                  v-on="on"
                >
                  Customize
                </v-card>
              </template>
              <span>This waffle's top layer has already been customized</span>
            </v-tooltip>
          </v-col>
          <v-col cols="6" class="ma-0 pa-0">
            <v-tooltip top transition="fade-transition">
              <template v-slot:activator="{ on }">
                <v-card
                  :disabled="waffle.maxLayersReached"
                  width="100%"
                  height="65"
                  flat
                  class="vh-center waffle-text option-button right"
                  @click="bakeWaffleLayer(waffle.id)"
                  v-on="on"
                >
                  Add Layer
                </v-card>
              </template>
              <span>Top layer must be customized before adding a new one</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="3" order="3" order-md="3" class="px-10">
        <template v-if="waffle.status(now) === WaffleStatus.Burned">
          <v-col cols="12" md="3" order="3" order-md="3" class="px-10">
            <v-row class="vh-center waffle-text-border-black" style="color:red;">
              BURNED!
            </v-row>
          </v-col>
        </template>
        <template v-else-if="waffle.published">
          <v-row class="vh-center waffle-text-border-black">
            Votes
          </v-row>
          <v-row class="vh-center waffle-text-border-black">
            {{ waffle.votes }}
          </v-row>
        </template>
        <template v-else>
          <v-row>
            <v-btn @click="publishWaffle(waffle.id)">
              Publish
            </v-btn>
          </v-row>
        </template>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import CountdownTimer from '~/components/helper/CountdownTimer'
import Waffle from '~/database/Waffle'
import WaffleDisplay from '~/components/WaffleDisplay'
import { WaffleStatus } from '~/interfaces/enums'

export default {
  name: 'InventoryWaffle',
  components: { CountdownTimer, WaffleDisplay },
  props: {
    waffle: {
      type: Waffle as Object,
      required: true
    }
  },
  data () {
    return {
      WaffleStatus
    }
  },
  computed: {
    ...mapGetters({
      now: 'getNow'
    })
  },
  methods: {
    publishWaffle (waffleId) {
      this.$store.dispatch('dialogs/displayConfirmation', {
        title: 'Publish this waffle?',
        body: 'Your waffle will be open for voting, but you will no longer be able to do customize it further.',
        affirmativeAction: () => {
          Waffle.dispatch('publishWaffle', waffleId)
        },
        affirmativeLabel: 'Publish Waffle'
      })
    },
    bakeWaffleLayer (waffleId) {
      Waffle.dispatch('bakeWaffleLayer', waffleId)
    },
    advanceWaffleCustomizationStep (waffleId) {
      Waffle.dispatch('advanceWaffleCustomizationStep', waffleId)
    },
    customizeWaffle (waffleId) {
      this.$router.push(`/waffle/${waffleId}/customize`)
    }
  }
}
</script>

<style scoped>
.waffle-overlay {
  position: absolute;
  border-radius: 25px;
  z-index: 500;
}

.waffle-subtitle {
  font-size: 22px;
}

.waffle-container {
  border-radius: 25px;
  border: 6px rgba(255, 255, 255, 0.7) solid;
  background: rgba(30, 188, 223, 0.33);
}

.option-button {
  font-size: 20px;
  border: 3px rgba(255, 255, 255, 0.7) solid;
  background: rgba(215, 215, 215, 0.33);
  user-select: none;
  background: radial-gradient(50% 50% at 50% 50%, #4BADC2 0%, #1A6D9B 100%);
}

.option-button.disabled {
  font-size: 20px;
  border: 3px rgba(255, 255, 255, 0.7) solid;
  background: rgba(215, 215, 215, 0.33);
  user-select: none;
  background: radial-gradient(50% 50% at 50% 50%, #1a3e46 0%, #0d2f41 100%) !important;
}

.option-button.left {
  border-right: 1.5px rgba(255, 255, 255, 0.7) solid;
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.option-button.right {
  border-left: 1.5px rgba(255, 255, 255, 0.7) solid;
  border-top-right-radius: 25px;
  border-bottom-right-radius: 25px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.add-ingredient-button {
  font-size: 10px;
}
</style>
