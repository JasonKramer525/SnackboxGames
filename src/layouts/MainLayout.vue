<template>
  <q-layout view="lHh Lpr lFf" style="background-color:#D3D3D3">
    <q-header elevated>
      <q-toolbar>
      <q-btn 
          class="" v-if="$route.fullPath.includes('/play')" 
          icon="arrow_back" label="Leave" flat dense @click="logoutUser"/>
        <!-- 
        

        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        /> ----->

        <q-toolbar-title class="absolute-center snackbox-font" v-if="$route.fullPath == '/'">
          snackbox.live
        </q-toolbar-title>
        <q-toolbar-title class="absolute-center snackbox-font" v-if="$route.fullPath == '/play'">
          {{userDetails.name}}
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer hidden
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import {mapState, mapActions} from 'vuex'

export default {
  name: 'MainLayout',

  components: {
    EssentialLink
  },
  computed: {
    ...mapState('store', ['messages', 'userDetails']),
  },
  methods: {
    ...mapActions('store',['logoutUser']),
  },


  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: 'Docs',
          caption: 'quasar.dev',
          icon: 'school',
          link: 'https://quasar.dev'
        },
        {
          title: 'Github',
          caption: 'github.com/quasarframework',
          icon: 'code',
          link: 'https://github.com/quasarframework'
        },
        {
          title: 'Discord Chat Channel',
          caption: 'chat.quasar.dev',
          icon: 'chat',
          link: 'https://chat.quasar.dev'
        },
        {
          title: 'Forum',
          caption: 'forum.quasar.dev',
          icon: 'record_voice_over',
          link: 'https://forum.quasar.dev'
        },
        {
          title: 'Twitter',
          caption: '@quasarframework',
          icon: 'rss_feed',
          link: 'https://twitter.quasar.dev'
        },
        {
          title: 'Facebook',
          caption: '@QuasarFramework',
          icon: 'public',
          link: 'https://facebook.quasar.dev'
        },
        {
          title: 'Quasar Awesome',
          caption: 'Community Quasar projects',
          icon: 'favorite',
          link: 'https://awesome.quasar.dev'
        }
      ]
    }
  }
}
</script>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css2?family=Bangers&display=swap');

  .snackbox-font
    font-family: 'Bangers', cursive;
    font-size: 30 px
</style>
