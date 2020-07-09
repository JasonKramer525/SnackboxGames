<template>
<div class="row justify-center text-center full-width q-mt-md">
    <div class="col-lg-5 col-xs-10" >
		<div class="title-font" v-if="!userDetails.host" >Waiting for the host to start the game</div>
		<div class="title-font" v-if="userDetails.host">You are the host.</div>
		<div class="title-font">Room Code: <a style="color:#1976D2; font-size:40px"> {{userDetails.code}} </a> </div>
		<div class="title-font q-mt-md">Current Players:</div>

		<div style="font-size: 20px" v-for="(user, key) in users">
		  {{ user.name }} <a v-if="user.host == true"> (Host) </a>
		</div>

	</div>
</div>
</template>


<script>
import {mapState, mapGetters} from 'vuex'

export default {
	computed: {
		...mapState('store', ['messages', 'userDetails']),
		...mapGetters('store', ['users'])
	},
	data(){
		return {
			showMessages: false
		}
	},
}

</script>

<style lang="stylus">
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Fira+Sans:wght@900&display=swap');
  .title-font
    font-family: 'Fira Sans', sans-serif;
    color: #333
    font-weight: 900
    font-size: 25px
    padding-left: 14px
</style>