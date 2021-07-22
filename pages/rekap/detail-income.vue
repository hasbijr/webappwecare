<template>
    <div class="background-custom">
        <div class="container">
            <div v-if="isLoading" class="row">
                <b-col cols="12" class="mt-3">
                    <b-skeleton-img no-aspect height="150px"></b-skeleton-img>
                </b-col>
            </div>
            <b-card v-else>
                <div class="row align-items-center">
                    <div class="col-md-12" style="color: #E42312; font-size: 1.6rem">
                        Income Campaign "{{dataCampaign.campaign.nama}}"
                    </div>
                    <div class="col-md-12" style="color: #E42312; font-size: 1.6rem">
                        Tanggal {{dataCampaign.tanggal_upload_tgl_id}}
                    </div>
                    <div class="col-md-10">
                        <div class="badge-sum">
                            Total: Rp. {{formatPrice(dataCampaign.sum_nominal)}}
                        </div>
                    </div>
                    <div class="col-md-1 offset-md-1">
                        <div class="circle" style="background-color: #E42312">
                            <span @click="downloadExcel()" class="material-icons icon-circle" style="color: #ffffff; top: calc(50% - 12px); position: relative;">
                                download
                            </span>
                        </div>
                    </div>
                </div>

                <div class="row" style="margin: 25px 15px 0px 15px;">
                    <div class="col-md-2">Tanggal</div>
                    <div class="col-md-2">No Referensi</div>
                    <div class="col-md-4">Nama</div>
                    <div class="col-md-2">Handphone</div>
                    <div class="col-md-2">Nominal</div>
                </div>
                
                <div v-for="dc in dataCampaign.income_details" :key="dc.id" class="row" style="margin: 25px 15px 0px 15px;">
                    <b-card class="col-md-12">
                        <div class="row align-items-center">
                            <div class="col-md-2">
                                <div style="text-align: left; margin: 5px 0px"> {{dc.tanggal_donasi.split(" ")[0]}} </div>
                            </div>
                            <div class="col-md-2">
                                {{dc.no_referensi}}
                            </div>
                            <div class="col-md-4">
                                <div style="text-align: left; margin: 5px 0px"> {{dc.nama}} </div>
                            </div>
                            <div class="col-md-2 divider-vertical">
                                <div style="text-align: left; margin: 5px 0px"> {{dc.handphone}} </div>
                            </div>
                            <div class="col-md-2">
                                <div style="text-align: left; margin: 5px 0px"> Rp. {{formatPrice(dc.nominal)}} </div>
                            </div>
                            <!-- <div class="col-md-1">
                                <div class="circle">
                                    <span @click="rekapData(dc.pendanaan_id)" class="material-icons icon-circle" style="color: #C4C4C4; top: calc(50% - 12px); position: relative">
                                        arrow_forward
                                    </span>
                                </div>
                            </div> -->
                        </div>
                    </b-card>

                    <!-- <div class="col-md-12 center">
                        <b-pagination
                            v-model="currentPage"
                            :total-rows="rows"
                            :per-page="perPage"
                            first-number
                        ></b-pagination>
                    </div> -->
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
            dataCampaign: undefined,
            baseURL: undefined,
            selected: undefined,
            isLoading: true,
            // currentPage: 1,
            // rows: undefined,
            // perPage: 15,
        }
    },
    created: function() {
        if(!this.$auth.loggedIn){
            this.$router.push('/login');
        }
        this.getDataRekap();
        this.baseURL = this.$axios.defaults.baseURL;
    },
    methods: {
        getDataRekap(){
            const token = this.$auth.strategy.token.get()
            const config = {
                headers: { Authorization: `${token}` },
            }
            this.$axios.$get(`campaign/${this.$route.query.id}/income/${this.$route.query.id_income}`, config).then(response => {
                console.log(response)
                this.dataCampaign = response;
                
                this.isLoading = false
                // this.rows = response.total;
            }).catch(e => {
                console.log(e)
                this.isLoading = false
            })
        },

        updateIncome(){
            this.$router.push('/rekap/update-income?id='+this.$route.query.id);
        },

        updateOutcome(){
            this.$router.push('/rekap/update-outcome?id='+this.$route.query.id);
        },

        // handleCurrentChange(val) {
        //     this.currentPage = val;
        //     this.getDataCampaign();
        // },

        updateCampaign(id) {
            this.$router.push('/campaign/update-campaign?id='+id);
        },

        formatPrice(value) {
            let val = (value/1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },

        downloadExcel() {
            const token = this.$auth.strategy.token.get()
            const config = {
                headers: { Authorization: `${token}` },
                responseType: 'blob'
            }
            let idCampaign = this.$route.query.id
            let idIncome = this.$route.query.id_income
            this.$axios.$get(`campaign/${idCampaign}/income/${idIncome}/excel?token=${token}`, config).then(response => {
                var fileURL = window.URL.createObjectURL(new Blob([response], {
                    type: 'application/vnd.ms-excel'
                }));
                var fileLink = document.createElement('a');

                fileLink.href = fileURL;
                fileLink.setAttribute('download', `Rekapitulasi Income ${this.dataCampaign.campaign.nama}`);
                document.body.appendChild(fileLink);

                fileLink.click();
            }).catch(e => {
                // this.isLoading = false
                console.log(e)
            })
        }
    }
}
</script>

<style>
.btn-group .btn, .input-group .btn{
    padding: 8px !important;
}

.dropdown-custom .btn-outline-primary {
    color: #ffffff;
    border-color: #E42312;
    background-color: #E42312;
    background-image: none;
}

/* .dropdown {
    border: 1px solid #ccc;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 20px;
} */
</style>