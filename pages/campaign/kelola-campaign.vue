<template>
    <div class="background-custom">
        <div class="container">
            <b-card>
                <div class="title-card" style="color: #E42312; font-size: 1.6rem">
                    Kelola Campaign
                </div>
                <div class="row" style="padding: 25px 15px 0px 15px;">
                    <b-card v-for="dc in dataCampaign" :key="dc.id" class="col-md-12">
                        <div class="row">
                            <div class="col-md-2 divider-vertical">
                                <b-badge v-if="dc.is_publish !== 1" style="color: #ffffff; background-color: #C4C4C4" class="badge-draft">Draft</b-badge>
                                <b-badge v-else style="color: #ffffff; background-color: #E42312;" class="badge-draft">Published</b-badge>
                            </div>
                            <div class="col-md-3">
                                <div style="text-align: center; margin: 5px 0px"> {{dc.tanggal_mulai}} </div>
                            </div>
                            <div class="col-md-5">
                                <div style="text-align: left; margin: 5px 0px"> {{dc.nama}} </div>
                            </div>
                            <div class="col-md-1">
                                <div class="circle">
                                    <span @click="rekapData(dc.id)" class="material-icons icon-circle" style="color: #C4C4C4; top: calc(50% - 12px); position: relative">
                                        text_snippet
                                    </span>
                                </div>
                            </div>
                            <div class="col-md-1">
                                <b-dropdown size="lg" variant="link" toggle-class="text-decoration-none" no-caret>
                                    <template #button-content>
                                        <span class="material-icons icon-circle" style="color: #C4C4C4; top: calc(50% - 10px); position: relative">
                                            more_horiz
                                        </span>
                                    </template>
                                    <b-dropdown-item @click="updateCampaign(dc.id)">Edit</b-dropdown-item>
                                    <b-dropdown-item @click="deleteCampaign(dc.id)">Hapus</b-dropdown-item>
                                </b-dropdown>
                            </div>
                        </div>
                    </b-card>

                    <div class="col-md-12 center">
                        <b-pagination
                            v-model="currentPage"
                            :total-rows="rows"
                            :per-page="perPage"
                            first-number
                        ></b-pagination>
                    </div>
                </div>
            </b-card>
        </div>
    </div>
</template>

<script>
export default {
    layout: 'navbar',
    data() {
        return {
            dataCampaign: [],
            baseURL: undefined,
            currentPage: 1,
            rows: undefined,
            perPage: 15
        }
    },
    created: function() {
        this.getDataCampaign();
        this.baseURL = this.$axios.defaults.baseURL;
        if(!this.$auth.loggedIn){
            this.$router.push('/login');
        }
    },
    methods: {
        async getDataCampaign(){      
            await this.$axios.$get(`campaign?show=all&page=${this.currentPage}`).then(response => {
                this.dataCampaign = response.data;
                this.rows = response.total;
            }).catch(e => {
                console.log(e)
            })
        },

        handleCurrentChange(val) {
            this.currentPage = val;
            this.getDataCampaign();
        },

        rekapData(id) {
            this.$router.push('/rekap/index-rekap?id='+id);
        },

        updateCampaign(id) {
            this.$router.push('/campaign/update-campaign?id='+id);
        },

        async deleteCampaign(id){
            this.boxTwo = ''
            this.$bvModal.msgBoxConfirm('Apakah anda yakin akan mengahpus campaign?.', {
            title: 'Please Confirm',
            size: 'md',
            buttonSize: 'md',
            okVariant: 'danger',
            okTitle: 'Ya',
            cancelTitle: 'Tidak',
            footerClass: 'p-2',
            hideHeaderClose: false,
            centered: true
            })
            .then(value => {
                if(value){
                    this.$axios.$delete(`campaign/${id}`).then(response => {
                        this.$bvToast.toast('Campaign berhasil di hapus', {
                            title: `Sukses`,
                            variant: 'success',
                            solid: true
                        })
                        this.getDataCampaign();
                    }).catch(e => {
                        this.$bvToast.toast(`${e}`, {
                            title: `terjadi kesalahan`,
                            variant: 'danger',
                            solid: true
                        })
                    })
                }
            })
            .catch(err => {
                this.$bvToast.toast(`${err}`, {
                    title: `terjadi kesalahan`,
                    variant: 'danger',
                    solid: true
                })
            })
            
        },

        showMsgBoxTwo() {
        this.boxTwo = ''
        this.$bvModal.msgBoxConfirm('Please confirm that you want to delete everything.', {
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'YES',
          cancelTitle: 'NO',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
          .then(value => {
            this.boxTwo = value
          })
          .catch(err => {
            // An error occurred
          })
      }
    }
}
</script>

<style>
.btn-group .btn, .input-group .btn{
    padding: 8px !important;
}
</style>