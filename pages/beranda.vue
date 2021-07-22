<template>
    <div class="background-custom">
        <div class="container" style="padding-top: 25px; padding-bottom: 25px;">
            <carousel :per-page="1" :autoplay="true" :navigationEnabled="true">
                <slide v-for="dcc in dataCampaignCarousel" :key="dcc.id">
                  <b-card
                    overlay
                    :img-src="baseURL +'/'+dcc.campaign_photo.path"
                    img-alt="Card Image"
                  >
                    <button v-on:click="redirectPage(dcc.id)" type="button" class="btn btn-md btn-donasi">Donasi Sekarang</button>
                  </b-card>
                </slide>              
            </carousel>
        </div>

        <div style="background-color: #ffffff">
            <div style="padding: 20px;">
                <div class="label-sub" style="padding-bottom:10px">
                    Campaign Mendesak
                </div>
                <b-row>
                    <b-col v-for="dc in dataCampaignUrgent" :key="dc.id" sm="4">
                        <b-card-group deck>
                          <NuxtLink :to="'/campaign/'+dc.id">
                            <b-card :img-src="baseURL +'/'+dc.campaign_photo.path" img-alt="Card image" img-top>
                                <b-card-text class="title-card">
                                    {{ dc.nama }}
                                </b-card-text>
                                <b-card-text>
                                    Dana Terkumpul: Rp 2.015.000,00
                                </b-card-text>
                            </b-card>
                            <div class="container-left">
                              Sisa hari: 6
                            </div>
                          </NuxtLink>
                        </b-card-group>
                    </b-col>
                </b-row>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  // middleware: 'auth',
  layout: 'navbar',
  data() {
    return {
      dataCampaignUrgent: [],
      dataCampaignCarousel: [],
      baseURL: undefined
    }
  },
  created: function(){
      this.getDataCampaignUrgent();
      this.getDataCampaignCarousel();
      this.baseURL = this.$axios.defaults.baseURL;
  }, 
  methods: {
    async getDataCampaignUrgent(){      
      await this.$axios.$get(`campaign?show=urgent`).then(response => {
        this.dataCampaignUrgent = response.data;
      }).catch(e => {
        console.log(e)
      })
    },
    async getDataCampaignCarousel(){      
      await this.$axios.$get(`campaign?show=carousel`).then(response => {
        console.log(response);
        this.dataCampaignCarousel = response;
      }).catch(e => {
        console.log(e)
      })
    },

    redirectPage(id){
      this.$router.push('/campaign/'+id);
    }
  }
}
</script>

<style lang="scss" scoped>
.label-sub{
    font-size: 18px;
    color: #E42312;
    font-weight: 700;
}

.title-card {
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 1.7;
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.card-deck {
  position: relative;
}

.container-left{
  position: absolute;
  left: 10%;
  top: 40%;
  color: #E42312;
  border-color: #ffffff;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgb(50 50 93 / 11%), 0 1px 3px rgb(0 0 0 / 8%);
  border-radius: 2.0em;
  font-size: 16px;
  padding: 5px 10px 5px 10px;
}

.card {
    cursor: pointer;
}

.card-img-top {
    border-top-left-radius: calc(.375rem - 1px);
    border-top-right-radius: calc(.375rem - 1px);
    height: 140px;
    object-fit: cover;
    object-position: center top;
}

.card-img, .card-img-left {
    object-fit: cover;
    height: 300px;
    width: 100%;
    border-top-left-radius: calc(1.25rem - 1px);
    border-top-right-radius: calc(1.25rem - 1px);
    border-bottom-left-radius: calc(1.25rem - 1px);
    border-bottom-right-radius: calc(1.25rem - 1px);
}
</style>