<template>
  <v-col class="ma-0 pa-0">
    <v-row class="waffle-text grand-prize-label mb-10 vh-center" :class="{'mobile': $vuetify.breakpoint.smAndDown}">
      Grand Prize
    </v-row>
    <v-row class="waffle-text mb-2 vh-center">
      <v-card max-width="750px" width="80vw" color="transparent" flat>
        <v-img class="vh-center" :src="require('~/static/home/ticket.png')">
          <v-col>
            <v-row class="waffle-text grand-prize-amount vh-center" :class="{'mobile': $vuetify.breakpoint.smAndDown}">
              25,047 USD
            </v-row>
            <v-row class="waffle-text vh-center">
              +2500 ONE
            </v-row>
            <v-row class="waffle-text vh-center">
              +12 YFL
            </v-row>
          </v-col>
        </v-img>
      </v-card>
    </v-row>
    <v-row class="vh-center mb-10">
      Time Left: 1 Day, 22 Hours, 17 Minutes
    </v-row>
    <v-row v-if="$vuetify.breakpoint.mdAndUp" class="waffle-text recent-waffles-label vh-center mt-12">
      Recent Waffles
    </v-row>
    <recent-waffles-display />
    <v-row class="faq-title-container waffle-text vh-center py-5">
      FAQ
    </v-row>
    <v-row class="faq-content-container vh-center">
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-row class="vh-center mt-12">
              <div class="waffle-text faq-title">
                What is it?
              </div>
              <div class="faq-content">
                The Great Waffle Competition is the latest and greatest blockchain craze on the Ethereum/Harmony network. Built as part of a collaboration between YF Link (YFL) and Harmony Protocol (ONE), we aim to create a fun incentive-based competition with game theory, community elements, and cash prizes.
                <br><br>
                May the most delicious waffle win!
              </div>
              <div>
                <v-img contain :src="require('~/static/home/faq/yflink-syrup.png')" />
              </div>
            </v-row>
            <v-row class="vh-center mt-12">
              <div class="waffle-text faq-title">
                How does it work
              </div>
              <div class="faq-content">
                The game is very simple. All you have to do is create a waffle, add your toppings and decorations, and win the community vote!
                <br><br>
                When the timer on the home page hits zero, the waffle with the most votes (voted on by YOU!) will be crowned the winner and win the grand prize.
                <br><br>
                The top 3 winners will also receive super-rare exclusive NFTs with original art as part of the contest!
              </div>
              <div class="mt-5">
                <v-img contain :src="require('~/static/home/faq/syrups.png')" />
              </div>
            </v-row>
            <v-row class="vh-center mt-12">
              <div class="waffle-text faq-title">
                Burn Mechanics
              </div>
              <div class="faq-content">
                Creating a waffle isn’t so easy though. If you fail to add the specified ingredient (YFL or ONE) in time, then you BURN your waffle.
                <br><br>
                The tokens sent to the holding wallet will be sent to a burn address - never to be recovered again! Oh the inhumanity!
                <br><br>
                The risk is worth it though - the more players that make waffles, the sweeter the pot at the end for the winner.
                <br><br>
                So - make the most attractive waffle, be voted as the leader, and make sure others BURN their waffles to improve your chances of winning!
              </div>
              <div>
                <v-img contain :src="require('~/static/home/faq/harmony-syrup.png')" />
              </div>
            </v-row>
          </v-col>
          <v-col cols="12" md="6">
            <v-row class="vh-center">
              <div v-if="$vuetify.breakpoint.mdAndUp">
                <v-img max-width="450" :src="require('~/static/home/faq/members.png')" />
              </div>
              <div class="waffle-text faq-title mt-4">
                Prizes?
              </div>
              <div class="faq-content">
                We’re incentivizing the game in a few ways:
                <br><br>
                1) Through our partnership with Harmony, who has graciously provided a generous $5,000 initial cash prize
                <br><br>
                2) Burn mechanics of the game that will increase the prize pool
                <br><br>
                3) Limited-Edition rare NFT’s created by the BONK team!
              </div>
              <div v-if="$vuetify.breakpoint.smAndDown">
                <v-img contain height="175px" class="mt-4" :src="require('~/static/home/faq/members.png')" />
              </div>
            </v-row>
            <v-row class="vh-center mt-12">
              <div class="waffle-text faq-title">
                How to waffle?
              </div>
              <div class="faq-content">
                Waffle creation is very easy. Once you connect your web3 wallet (we recommend Metamask) to the site, you can create a waffle.
                <br><br>
                You’ll start by sending YFL to the Harmony bridge, which will convert your tokens to the Harmony network.
                <br><br>
                The fee for creating a waffle is .005 YFL, but we recommend loading your account with more YFL for additional layers and syrups. You’ll also need some Harmony tokens later, so keep this in mind.
                <br><br>
                Once you send your YFL and it is confirmed, you will be taken to the waffle cooking page, where you will see a 24 hour countdown. Within that countdown there will be specific periods where you must send more ingredients (ONE/YFL tokens) to a specified address.
                <br><br>
                80% of all tokens sent for waffle creation are added to the grand prize. 10% are sent to the dev wallet, and the final 10% are sent to a holding wallet. This 10% goes back to the user once their waffle/layer is successfully completed, acting as a discount.
                <br><br>
                After 24 hours your waffle will be complete. Afterwards you can customize, add additional layers, and so on.
                <br><br>
                Build your dream waffle!
              </div>
              <div>
                <v-img contain :src="require('~/static/home/faq/burn.png')" />
              </div>
            </v-row>
            <v-row class="vh-center mt-12">
              <div class="waffle-text faq-title">
                Why Harmony?
              </div>
              <div class="faq-content">
                We think Ethereum is great, but gas fees are getting outrageous. A game like this would be impossible with the current fee structure of Ethereum.
                <br><br>
                We want our digital waffles to cost about as much as the creation of a real world waffle - something we can’t do with current gas fees.
                <br><br>
                Harmony on the other hand is fast, EVM compatible, and their team has shown the YF Link team great support and help in putting this game together.
                <br><br>
                We think it’s a great way of combining our communities, and rewarding people who take part. The game itself is pretty damn fun too.
              </div>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-row>
    <v-row class="vh-center begin-container">
      <v-col class="my-12">
        <v-row class="vh-center waffle-text begin-label">
          Ready to begin?
        </v-row>
        <v-row class="vh-center">
          <v-btn
            to="/create"
            width="80vw"
            max-width="450px"
            height="100px"
            :class="{'mobile': $vuetify.breakpoint.smAndDown}"
            class="waffle-text make-waffle-button"
          >
            Make My Waffle
          </v-btn>
        </v-row>
        <v-row class="vh-center mt-5">
          <v-img max-width="250" contain :src="require('~/static/waffles/waffle.png')" />
        </v-row>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import RecentWafflesDisplay from '@/components/RecentWafflesDisplay'

export default {
  middleware: 'accountConnected',
  components: {
    RecentWafflesDisplay
  }
}
</script>

<style lang="scss" scoped>
  .grand-prize-label {
    font-size: 45pt;
  }

  .grand-prize-label.mobile {
    font-size: 32pt;
  }

  .grand-prize-amount {
    font-size: 71px;
    line-height: 103px;
    text-shadow: 0 0 5.97701px rgba(255, 255, 255, 0.76);
  }

  .grand-prize-amount.mobile {
    font-size: 40px !important;
    line-height: 45px !important;
  }

  .recent-waffles-label {
    font-size: 35px;
  }

  .faq-title-container {
    background: url(../static/home/conveyer-pattern.png) repeat-x;
    background-size: contain;
    font-size: 65px;
    text-shadow: -2px 0 #000000, 0 2px #000000, 2px 0 #000000, 0 -2px #000000;
    animation: ScrollBackgroundHorizontal 5s linear infinite;
  }

  .faq-content-container {
    background: url(../static/home/faq-background.png) repeat;
    animation: ScrollBackground 10s linear infinite;
  }

  .faq-title {
    padding: 6px 55px 6px 55px;
    text-align: center;
    font-size: 35px;
    border-radius: 50px;
    background-color: #3D3D3D;
  }

  .faq-content {
    line-height: 13pt;
    margin: 15px 80px 0 80px;
    text-align: justify;
    font-family: Roboto, serif;
    font-size: 12pt;
  }

  .begin-container {
    border-top: 10px black solid;
    background: rgb(20,20,20);
    background: radial-gradient(circle, rgba(20,20,20,1) 0%, rgba(25,0,0,1) 83%);
  }

  .begin-label {
    font-size: 50px;
  }

  .make-waffle-button {
    padding: 20px;
    font-size: 40px;
    border-radius: 50px;
    text-shadow: -2px 0 #000000, 0 2px #000000, 2px 0 #000000, 0 -2px #000000;
    border: 3px white solid;
    background: radial-gradient(50% 50% at 50% 50%, #4BADC2 0%, #003553 100%);
  }

  .make-waffle-button.mobile {
    font-size: 20px !important;
  }

  @keyframes ScrollBackgroundHorizontal {
    0% {
      background-position: 0 0;
    }

    100% {
      background-position: 70px 0;
    }
  }

  @keyframes ScrollBackground {
    0% {
      background-position: 0 0;
    }

    100% {
      background-position: 250px -250px;
    }
  }

</style>
