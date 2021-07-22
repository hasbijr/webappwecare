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
                        Kelola Penyaluran Dana Donasi
                    </div>
                </div>
                <div v-for="(dc,index) in dataDonasi" :key="index" class="row" style="padding: 25px 15px 0px 15px;">
                    <div>
                        {{dc.created_at}}
                    </div>
                    <b-card class="col-md-12">
                        <div class="row align-items-center">
                            <div class="col-md-3 divider-vertical">
                                <b-badge v-if="dc.status == '0'" style="color: #ffffff; background-color: #C4C4C4" class="badge-draft">Belum Selesai</b-badge>
                                <b-badge v-else style="color: #ffffff; background-color: #E42312;" class="badge-draft">Selesai</b-badge>
                                <!-- <b-badge style="color: #ffffff; background-color: #E42312;" class="badge-draft">Belum Selesai</b-badge> -->
                            </div>
                            <div class="col-md-6">
                                <div style="text-align: left; margin: 5px 0px"> {{dc.outcome.campaign.nama}} </div>
                            </div>
                            <div class="col-md-2">
                                <div style="text-align: left; margin: 5px 0px"> Rp. {{formatPrice(dc.nominal)}} </div>
                            </div>
                            <div class="col-md-1">
                                <div v-if="dc.status == 0" class="circle">
                                    <span @click="penyaluran(dc.id)" class="material-icons icon-circle" style="color: #C4C4C4; top: calc(50% - 12px); position: relative">
                                        arrow_forward
                                    </span>
                                </div>

                                <div v-else class="circle" style="background-color: #E42312 !important">
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
                                                        <div class="col-md-12 text-center">
                                                            <a 
                                                            :href="`${odp.url_evidence}?token=${$auth.strategy.token.get()}`" 
                                                            target="_blank"
                                                            v-text="'Dowload Evidence'" 
                                                            style="color: #e42312">Download Evidence</a>
                                                        </div>
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
                isLoading: false,
                dataDonasi: undefined,
                baseURL: undefined
            }
        },
        mounted(){
            this.getDataRekap()
        },
        created: function(){
            if(!this.$auth.loggedIn){
                this.$router.push('/login');
            }
            this.baseURL = this.$axios.defaults.baseURL;
        },
        methods: {
            getDataRekap(){
                this.isLoading = true
                const token = this.$auth.strategy.token.get()
                const config = {
                    headers: { Authorization: `${token}` },
                }
                this.$axios.$get(`distribution`, config).then(response => {
                    this.dataDonasi = response;
                    this.isLoading = false
                    console.log(response)
                    // this.rows = response.total;
                }).catch(e => {
                    this.isLoading = false
                    console.log(e)
                })
            },
            penyaluran(id) {
                this.$router.push(`/agen/penyaluran-dana?id=${id}`)
            },
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
            downloadItem ({ url_evidence }) {
                window.open(url_evidence, '_blank')
                // this.$axios.get(url_evidence, { responseType: 'blob' })
                // .then(response => {
                //     const blob = new Blob([response.data], { type: 'application/img' })
                //     const link = document.createElement('a')
                //     link.href = URL.createObjectURL(blob)
                //     link.download = `${nama_point}.${ekstensi}`
                //     link.click()
                //     URL.revokeObjectURL(link.href)
                // }).catch(console.error)
            }
        },
    }
</script>