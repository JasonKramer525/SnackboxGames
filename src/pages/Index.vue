<template>
<div class="row justify-center full-width q-mt-md">
      <div class="col-lg-3 col-xs-10" >
       	<div class="title-font" style="user-select: none;">ROOM CODE</div>
       			<q-input class="input-font" filled mask="AAAA" v-model="formData.code" placeholder="ENTER 4-LETTER CODE" lazy-rules
        		:rules="[ val => val && val.length == 4 || 'Please enter a 4 character room code']" ref="code"/>
       	<div class="q-mt-md title-font" style="user-select: none;">NAME</div>
       			<q-input class="input-font" mask="XXXXXXXXXX" filled v-model="formData.username" placeholder="ENTER YOUR NAME" 
       			lazy-rules  ref="username"
        		:rules="[ val => val && val.length > 0  || 'Please enter a username']"
       			/>
       

</div>
<div class="row justify-center full-width q-mt-md">
<q-btn
      size="22px"
      class="q-px-xl q-py-xs q-mt-md"
      color="primary"
      label="Play"
      @click="joinGame"
    	/>
          </div>
</div>
</template>

<script>
	import {mapActions} from 'vuex'

export default {
	name: 'PageIndex',
	data () {
		return {
			formData: {
		  		code: '',
		  		username: ''
	  		}
		}
	},
	methods: {
		...mapActions('store',['playGame']),
		joinGame(){
      		this.$refs.username.validate()
      		this.$refs.code.validate()

      		if (!this.$refs.username.hasError && !this.$refs.code.hasError) {
      		    console.log(this.formData.code)
				console.log(this.formData.username) 
				this.playGame(this.formData)
      		}

			
		}
	}
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
  .input-font
    font-family: 'Fire Sans', sans-serif;
    font-size: 18px
    font-weight: 200
</style>