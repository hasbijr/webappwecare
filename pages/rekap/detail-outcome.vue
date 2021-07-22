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
                        Outcome Campaign "{{dataCampaign.campaign.nama}}"
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
                    <div class="col-md-3 text-center">
                        Status
                    </div>
                    <div class="col-md-4 text-center">
                        Agent
                    </div>
                    <div class="col-md-2 text-center">
                        Distribution
                    </div>
                    <div class="col-md-2 text-center">
                        Sisa
                    </div>
                </div>

                <div v-for="dc in dataCampaign.outcome_distribution_points" :key="dc.id" class="row" style="margin: 25px 15px 0px 15px;">
                    <div>
                        {{dc.created_at_tgl_id}}
                    </div>
                    <b-card class="col-md-12">
                        <div class="row align-items-center">
                            <div class="col-md-3 divider-vertical">
                                <b-badge v-if="dc.status==0" style="color: #ffffff; background-color: #C4C4C4" class="badge-draft">Belum Disalurkan</b-badge>
                                <b-badge v-else style="color: #ffffff; background-color: #E42312" class="badge-draft">Sudah Disalurkan</b-badge>
                            </div>
                            <div class="col-md-4">
                                <div style="text-align: left; margin: 5px 0px"> {{dc.campaign_agent.user.userinformation.nama}} </div>
                            </div>
                            <div class="col-md-2">
                                <div style="text-align: left; margin: 5px 0px"> Rp. {{formatPrice(dc.sum_distribution_point)}} </div>
                            </div>
                            <div class="col-md-2">
                                <div style="text-align: left; margin: 5px 0px"> Rp. {{formatPrice(dc.sisa_distribution_point)}} </div>
                            </div>
                            <div class="col-md-1">
                                <div v-if="dc.status == 1" class="circle">
                                    <span block v-b-toggle="'accordion-'+dc.id" class="material-icons icon-circle-red" style="color: #ffffff; top: calc(50% - 12px); position: relative">
                                        keyboard_arrow_down
                                    </span>
                                </div>
                            </div>
                            <div v-if="dc.status == 1" class="col-md-12">
                                <b-collapse :id="'accordion-'+dc.id" visible accordion="my-accordion" role="tabpanel">
                                    <b-card-body>
                                        <div class="row">
                                            <div v-for="(odp, idx) in dc.outcome_distribution_points" :key="idx" class="col-md-6" style="padding: 5px">
                                                <b-card>
                                                    <div class="row">
                                                        <div class="col-md-12" style="text-align: center; font-size: 1.5rem;">
                                                            {{odp.nama_point}}
                                                        </div>
                                                        <div class="col-md-12" style="text-align: center; font-size: 1.0rem;">
                                                            {{'Tanggal Penyaluran '+odp.tanggal_tgl_id}}
                                                        </div>
                                                        <div class="col-md-12">
                                                            <div class="row" style="margin: 5px 10px;padding: 10px; background-color: #E5E5E5; border-radius: 20px">
                                                                <div class="col-md-2">
                                                                    Rp. 
                                                                </div>
                                                                <div class="col-md-10 text-right">
                                                                    {{formatPrice(odp.jumlah_dana)}}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <a 
                                                            :href="`${odp.url_evidence}?token=${$auth.strategy.token.get()}`" 
                                                            target="_blank"
                                                            v-text="'Dowload Evidence'" 
                                                            style="color: #e42312">Download Evidence</a>
                                                    </div>
                                                </b-card>
                                            </div>
                                        </div>
                                    </b-card-body>
                                </b-collapse>
                            </div>
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
            this.$axios.$get(`campaign/${this.$route.query.id}/outcome/${this.$route.query.id_outcome}`, config).then(response => {
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
            let idOutcome = this.$route.query.id_outcome
            this.$axios.$get(`campaign/${idCampaign}/outcome/${idOutcome}/excel?token=${token}`, config).then(response => {
                var fileURL = window.URL.createObjectURL(new Blob([response], {
                    type: 'application/vnd.ms-excel'
                }));
                var fileLink = document.createElement('a');

                fileLink.href = fileURL;
                fileLink.setAttribute('download', `Rekapitulasi Outcome ${this.dataCampaign.campaign.nama}`);
                document.body.appendChild(fileLink);

                fileLink.click();
            }).catch(e => {
                // this.isLoading = false
                console.log(e)
            })
        },

        downloadItem ({ url, ekstensi }, {nama_point}) {
            this.$axios.get(url, { responseType: 'blob' })
            .then(response => {
                const blob = new Blob([response.data], { type: 'application/img' })
                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = `${nama_point}.${ekstensi}`
                link.click()
                URL.revokeObjectURL(link.href)
            }).catch(console.error)
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