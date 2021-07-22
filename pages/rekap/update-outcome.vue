<template>
    <div class="background-custom">
        <div class="container">
            <b-card>
                <div class="row align-items-center">
                    <div class="col-md-12 align-self-center" align="center" style="color: #E42312; font-size:25px;">
                        Update Outcome
                    </div>
                    <div class="col-md-12 align-self-center" align="center" style="color: #E42312; font-size:25px;">
                        Campaign “Donasi untuk NTB”
                    </div>
                    <br><br>
                    <div class="col-md-12" align="center">
                         Perbaiki data dengan teliti, lakukan pengcekan ulang sebelum di publish kembali.
                    </div>

                    <div class="col-md-12" style="padding: 30px 20px">
                        <b-card>
                            <b-form @submit="onSubmit">
                                <div class="row align-items-center">
                                    <div class="col-md-10">
                                        Apakah dana ingin disalurkan lewat Agen Sahabat WeCare?
                                    </div>
                                    <div class="col-md-1 offset-md-1 align-self-end">
                                        <b-form-checkbox v-model="agent" size="lg" switch disabled></b-form-checkbox>
                                    </div>
                                </div>

                                <div v-if="agent" class="row align-items-center" style="margin-top: 20px">
                                    <div class="col-md-6">
                                        <b-form-group
                                            id="input-group-1"
                                            label="Biaya Administrasi:"
                                            label-for="input-1"
                                        >
                                            <b-form-input
                                            id="input-1"
                                            v-model="form.biaya_administrasi_agent"
                                            placeholder="Rp. "
                                            required
                                            type="text"
                                            :formatter="numberFormat"
                                            ></b-form-input>
                                        </b-form-group>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="row">
                                            <div v-for="(da, index) in dataCampaign.campaign_agents" :key="index" class="col-md-6">
                                                <b-card>
                                                    <b-form-group
                                                        :id="`dana${da.id}`"
                                                        :label="da.user.userinformation.nama"
                                                        label-for="input-1"
                                                    >
                                                        <b-form-input
                                                        :id="`dana${da.id}`"
                                                        v-model="form.agents[index].nominal"
                                                        placeholder="Rp. "
                                                        required
                                                        :formatter="numberFormat"
                                                        ></b-form-input>
                                                    </b-form-group>
                                                </b-card>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row align-items-center" style="margin-top: 20px">
                                    <div class="col-md-10">
                                        Apakah dana telah disalurkan ke tempat donasi?
                                    </div>
                                    <div class="col-md-1 offset-md-1 align-self-end">
                                        <b-form-checkbox v-model="yayasan" size="lg" switch></b-form-checkbox>
                                    </div>
                                </div>

                                <div v-if="yayasan" class="row align-items-center" style="margin-top: 20px">
                                    <div class="col-md-12">
                                        <b-form-group
                                            id="input-group-1"
                                            label="Nama Tempat Donasi"
                                            label-for="input-1"
                                        >
                                            <b-form-input
                                            id="input-1"
                                            v-model="form.nama_yayasan"
                                            placeholder="Nama Yayasan"
                                            required
                                            ></b-form-input>
                                        </b-form-group>
                                    </div>

                                    <div class="col-md-6">
                                        <b-form-group
                                            id="input-group-1"
                                            label="Jumlah Donasi"
                                            label-for="nominal_yayasan"
                                        >
                                            <b-form-input
                                            id="nominal_yayasan"
                                            v-model="form.nominal"
                                            placeholder="Rp. "
                                            required
                                            :formatter="numberFormat"
                                            ></b-form-input>
                                        </b-form-group>
                                    </div>
                                    <div class="col-md-6">
                                        <b-form-group
                                            id="input-group-1"
                                            label="Biaya Administrasi"
                                            label-for="admin_yayasan"
                                        >
                                            <b-form-input
                                            id="admin_yayasan"
                                            v-model="form.biaya_administrasi_yayasan"
                                            placeholder="Rp. "
                                            required
                                            :formatter="numberFormat"
                                            ></b-form-input>
                                        </b-form-group>
                                    </div>

                                    <div class="col-md-12">
                                        <b-form-group
                                            id="input-group-1"
                                            label="Evidence Penyaluran Dana"
                                            label-for="file-1"
                                            description="* File harus berekstensi .jpg/.png"
                                        >
                                            <b-form-file
                                            v-model="form.file"
                                            :state="Boolean(form.file)"
                                            placeholder="Choose a file or drop it here..."
                                            drop-placeholder="Drop file here..."
                                            ></b-form-file>
                                        </b-form-group>
                                    </div>
                                </div>

                                <div class="row" style="margin-top: 50px">
                                    <div class="col-md-2 offset-md-5">
                                        <b-button v-if="!isLoading" @click.prevent="onSubmit()" class="btn-login" type="submit" variant="primary">Simpan</b-button>
                                        <div v-else class="text-center">
                                            <b-spinner variant="danger" label="Spinning"></b-spinner>
                                        </div>
                                    </div>
                                </div>
                            </b-form>
                        </b-card>
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
            dataCampaign: {},
            agent: false,
            yayasan: false,
            form: {
                agents: [],
                biaya_administrasi_agent: 0,
                yayasan: false,
                nama_yayasan: undefined,
                nominal: 0,
                biaya_administrasi_yayasan: 0,
                file: null,
                
            },
            baseURL: undefined,
            show: true,
            isLoading: false,
            // currentPage: 1,
            // rows: undefined,
            // perPage: 15,
        }
    },
    created: function() {
        this.getDataCampaign();
        this.getAgent();
        this.baseURL = this.$axios.defaults.baseURL;
    },
    methods: {
        onSubmit() {
            // this.isLoading = true
            const token = this.$auth.strategy.token.get()
            const config = {
                headers: { Authorization: `${token}` },
            }

            const formData = new FormData()
            formData.append('outcome[biaya_administrasi_agent]', this.form.biaya_administrasi_agent.replace(/\D+/g, ""))
            this.form.agents.forEach(function (k,v) {
                formData.append(`outcome[agents][${v}][campaign_agent_id]`, k.campaign_agent_id)
                formData.append(`outcome[agents][${v}][nominal]`, k.nominal.replace(/\D+/g, ""))
            })

            if(this.yayasan){
                formData.append('outcome[biaya_administrasi_yayasan]', this.form.biaya_administrasi_yayasan.replace(/\D+/g, ""))
                formData.append('outcome[yayasan][nama_yayasan]', this.form.nama_yayasan)
                formData.append('outcome[yayasan][nominal]', this.form.nominal.replace(/\D+/g, ""))
                formData.append('outcome[yayasan][file]', this.form.file)
            }
            

            this.$axios.$post(`campaign/${this.$route.query.id}/outcome`, formData, config)
            .then((data) => {
                
                if(data.success){
                    this.$bvToast.toast(`Terjadi kesalahan pada api`, {
                        title: 'Sukses',
                        autoHideDelay: 5000,
                        appendToast: true,
                        variant: 'success',
                    })
                    this.$router.push('/rekap/index-rekap?id='+this.$route.query.id);
                }

                this.isLoading = false
            }).catch((error) => {
                this.$bvToast.toast(`Terjadi kesalahan pada api`, {
                    title: 'Terjadi kesalahan',
                    autoHideDelay: 5000,
                    appendToast: true,
                    variant: 'danger',
                })
                this.isLoading = false
            })
        },
        async getDataCampaign(){      
            await this.$axios.$get(`campaign/${this.$route.query.id}`).then(response => {
                this.dataCampaign = response;
                this.form.agents = [];
                let arrAgent = []

                response.campaign_agents.forEach(element => {
                    arrAgent.push({nominal: 0})
                });

                this.form.agents = arrAgent

                this.getAgent();

                if(this.dataCampaign.campaign_agents){
                    this.agent = true
                }
                
            }).catch(e => {
                console.log(e)
            })
        },

        async getAgent(){
            await this.$axios.$get(`campaign/${this.$route.query.id}/agent`).then(response => {
                this.form.agents = [];
                let arrAgent = []
                console.log(response);
                response.forEach(element => {
                    arrAgent.push({campaign_agent_id: element.id, nominal: 0})
                });

                this.form.agents = arrAgent

                if(this.response){
                    this.agent = true
                }
                
            }).catch(e => {
                console.log(e)
            })
        },

        // handleCurrentChange(val) {
        //     this.currentPage = val;
        //     this.getDataCampaign();
        // },

        rekapData(id) {
            alert(id);
        },

        updateCampaign(id) {
            this.$router.push('/campaign/update-campaign?id='+id);
        },

        formatPrice(value) {
            console.log(value)
            let val = (value/1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        numberFormat(value) {
            this.points = Number(value.replace(/\D/g, ''))
            return value == '0' ? '' : 'Rp. '+this.points.toLocaleString();
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