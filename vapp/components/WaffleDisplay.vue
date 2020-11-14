<template>
  <v-card
    :width="containerWidth"
    :height="containerHeight"
    color="transparent"
    class="waffle-container"
    :class="{'viewable': viewable}"
    flat
    tile
  >
    <div v-if="viewable" style="position: absolute;" class="vh-center fill-both view-text waffle-text-border-black" @click="viewWaffle">
      <span>
        View
      </span>
    </div>
    <v-img
      :src="require('~/static/waffles/plates/gold.png')"
      :width="width"
      :height="height"
      contain
      :style="waffleStyle(0)"
      class="waffle-plate vh-center"
      aspect-ratio="2.5"
    >
      <div class="layer-info fill-height" :class="{'expanded': expanded}">
        <div class="layer-info-title">
          Plate
        </div>
        <div>
          Golden Plate
        </div>
      </div>
    </v-img>
    <v-img
      v-for="(layer, index) in waffle.layers"
      :key="index"
      :src="require('~/static/waffles/waffle.png')"
      :width="width"
      :height="height"
      :style="waffleStyle(index + 1)"
      contain
      class="waffle vh-center"
      aspect-ratio="2.5"
    >
      <div class="vh-center fill-both">
        <img class="waffle-item" :src="layer.base.image" alt="base">
        <img class="waffle-item" :src="layer.topping.image" alt="topping">
      </div>
      <div class="layer-info" :class="{'expanded': expanded}">
        <div class="layer-info-title">
          Layer {{ index + 1 }}
        </div>
        <div>
          Topping: {{ layer.topping.name }}
        </div>
        <div>
          Base: {{ layer.base.name }}
        </div>
      </div>
    </v-img>
  </v-card>
</template>

<script lang="ts">
import Waffle from '~/database/Waffle'

const WH_RATIO = 2.5
const LAYER_OFFSET = -30
const EXPANDED_MULTIPLIER = 2.3

export default {
  name: 'WaffleDisplay',
  props: {
    waffle: {
      type: Waffle as Object,
      required: true
    },
    width: {
      type: [Number, String],
      default: 300
    },

    viewable: {
      type: Boolean,
      default: false
    },
    expanded: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    layerCount () {
      return this.waffle.layers.length
    },

    height () {
      return this.width / WH_RATIO
    },

    containerWidth () {
      return this.expanded ? this.width * 1.5 : this.width
    },
    containerHeight () {
      const heightRatioAdd = this.expanded ? 0.9 : 0.35
      return this.height + (this.height * heightRatioAdd * (this.layerCount - 1))
    },

    waffleStyle () {
      return (index) => {
        const translateValueCalc = this.expanded ? LAYER_OFFSET * EXPANDED_MULTIPLIER : LAYER_OFFSET
        const translateValueY = index * translateValueCalc
        return {
          transform: `translateY(${translateValueY}%)`,
          'z-index': index
        }
      }
    }
  },
  methods: {
    viewWaffle () {
      if (this.viewable) {
        this.$nuxt.$router.push({ query: { view: this.waffle.id } })
      }
    }
  }
}
</script>

<style scoped>
  .waffle-container {
    transition: all .3s;
    user-select: none;
  }

  .viewable {
    cursor: pointer;
  }

  .viewable:hover {
    filter: drop-shadow(0px 0px 10px #ffdd00);
  }

  .viewable:hover .waffle-item {
    filter: grayscale(100%);
  }

  .viewable:hover .waffle-plate {
    filter: grayscale(100%);
  }

  .viewable:hover .waffle {
    filter: grayscale(100%);
  }

  .view-text {
    font-size: 25px;
    transition: opacity .2s;
    transform: translateX(-5%);
    opacity: 0;
    z-index: 100;
  }

  .viewable:hover .view-text {
    opacity: 1;
  }

  .waffle {
    position:absolute;
    bottom:0;
    transition: all .3s;
    overflow: visible;
    transform: rotateX(0deg);
  }

  .waffle-plate {
    position:absolute;
    bottom:0;
    transition: all .3s;
    overflow: visible;
  }

  .waffle-plate.expanded {
    transition: opacity .25s;
    opacity: 0;
  }

  .waffle-item {
    position: absolute;
    width: 100%;
    height: 100%;
    transition: all .5s;
    transform: rotateX(0deg);
  }

  .layer-info-title {
    font-size:15pt;
  }

  .layer-info {
    text-align: left;
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0;
    transform: translateX(80%) translateY(40%);
    transition: opacity .25s;
  }

  .layer-info.expanded {
    opacity: 1;
    transition: opacity .25s;
  }
</style>
