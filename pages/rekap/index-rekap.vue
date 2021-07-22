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
                    <div class="col-md-8" style="color: #E42312; font-size: 1.6rem">
                        Rekapitulasi Pendanaan Campaign "{{dataCampaign.nama}}"
                    </div>
                    <div class="col-md-1 offset-md-1">
                        <div class="circle" style="background-color: #E42312">
                            <span @click="downloadExcel()" class="material-icons icon-circle" style="color: #ffffff; top: calc(50% - 12px); position: relative;">
                                download
                            </span>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <b-dropdown
                            split
                            split-variant="outline-primary"
                            variant="primary"
                            text="Update"
                            class="dropdown-custom"
                        >
                            <b-dropdown-item @click="updateIncome()" href="#">Income</b-dropdown-item>
                            <b-dropdown-item @click="updateOutcome()" href="#">Outcome</b-dropdown-item>
                        </b-dropdown>
                    </div>
                    <div class="col-md-4">
                        <div class="badge-sum" style="width: 100% !important">
                            Income: Rp. {{formatPrice(dataCampaign.sum_total_income)}}
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="badge-sum" style="width: 100% !important">
                            Outcome: Rp. {{formatPrice(dataCampaign.sum_total_outcome)}}
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="badge-sum" style="width: 100% !important">
                            Total: Rp. {{formatPrice(dataCampaign.sum_total_income-dataCampaign.sum_total_outcome)}}
                        </div>
                    </div>
                </div>
                
                <div v-for="(dc,index) in dataCampaign.rekapitulasi_pendanaan.data" :key="index" class="row" style="padding: 25px 15px 0px 15px;">
                    <div>
                        {{dc.created_at_tgl_id}}
                    </div>
                    <b-card class="col-md-12">
                        <div class="row align-items-center">
                            <div class="col-md-2 divider-vertical">
                                <b-badge v-if="dc.type != 'income'" style="color: #ffffff; background-color: #C4C4C4" class="badge-draft">Outcome</b-badge>
                                <b-badge v-else style="color: #ffffff; background-color: #E42312;" class="badge-draft">Income</b-badge>
                            </div>
                            <div class="col-md-2">
                                <div style="text-align: left; margin: 5px 0px"> Rp. {{formatPrice(dc.nominal)}} </div>
                            </div>
                            <div class="col-md-7">
                                <div style="text-align: left; margin: 5px 0px"> Agen, Yayasan A, Yayasan B </div>
                            </div>
                            <div class="col-md-1">
                                <div class="circle">
                                    <span @click="rekapData(dc.pendanaan_id, dc.type)" class="material-icons icon-circle" style="color: #C4C4C4; top: calc(50% - 12px); position: relative">
                                        arrow_forward
                                    </span>
                                </div>
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
            dataCampaign: [],
            baseURL: undefined,
            selected: undefined,
            options: [
                { value: 'income', text: 'Income' },
                { value: 'outcome', text: 'Outcome' },
            ],
            isLoading: false,
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
            this.isLoading = true
            const token = this.$auth.strategy.token.get()
            const config = {
                headers: { Authorization: `${token}` },
            }
            this.$axios.$get(`campaign/${this.$route.query.id}/income-outcome`, config).then(response => {
                this.dataCampaign = response;
                this.isLoading = false
                this.rows = response.total;
            }).catch(e => {
                this.isLoading = false
                console.log(e)
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

        rekapData(id, type) {
            if(type == 'income'){
                this.$router.push(`/rekap/detail-income?id=${this.$route.query.id}&id_income=${id}`)
            }else{
                this.$router.push(`/rekap/detail-outcome?id=${this.$route.query.id}&id_outcome=${id}`)
            }
            
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
            this.$axios.$get(`campaign/${idCampaign}/income-outcome/excel?token=${token}`, config).then(response => {
                var fileURL = window.URL.createObjectURL(new Blob([response], {
                    type: 'application/vnd.ms-excel'
                }));
                var fileLink = document.createElement('a');

                fileLink.href = fileURL;
                fileLink.setAttribute('download', `Rekapitulasi Pendanaan ${this.dataCampaign.nama}`);
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