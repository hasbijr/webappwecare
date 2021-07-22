<template>
    <div class="background-custom">
        <div class="container">
            <div v-if="isLoading" class="row">
                <b-col cols="12" class="mt-3">
                    <b-skeleton-img no-aspect height="150px"></b-skeleton-img>
                </b-col>
            </div>

            <b-card>
                <div class="row align-items-center">
                    <div align="center" class="col-md-12" style="color: #E42312; font-size: 1.6rem">
                        Penyaluran Dana Campaign “{{dataAgen ? dataAgen.outcome.campaign.nama : ''}}”
                    </div>
                    <div align="center" class="col-md-12">
                        Petunjuk untuk campaign baru Petunjuk untuk campaign baru Petunjuk untuk campaign baru Petunjuk untuk campaign baru Petunjuk untuk campaign baru
                    </div>
                </div>
                <div v-for="(data, index) in form" :key="index" class="row align-item-center">
                    <div class="col-md-12 accordion">
                        <b-card no-body class="mb-1">
                            <b-card-header header-tag="header" class="p-1" role="tab">
                                <b-button block v-b-toggle="'accordion-'+index" class="accord" variant="info">Distribution Point {{index+1}}</b-button>
                            </b-card-header>
                            <b-collapse :id="'accordion-'+index" visible accordion="my-accordion" role="tabpanel">
                                <b-card-body class="row">
                                    <div class="col-md-4">
                                        <b-form-group id="input-group-3" label="Jenis Distribution Point" label-for="jenis">
                                            <b-form-select
                                            id="jenis"
                                            v-model="data.jenis"
                                            
                                            required
                                            >
                                                <option v-for="jt in jenis_distribution" :key="jt.id" :value="jt.id">{{jt.name}}</option>
                                            </b-form-select>
                                        </b-form-group>
                                    </div>

                                    <div class="col-md-12">
                                        <b-form-group
                                        :id="`fieldset-${index}`"
                                        label="Nama Distribution Point"
                                        label-for="nama"
                                        :invalid-feedback="invalidFeedback"
                                        :state="state"
                                        >
                                            <b-form-input :id="`nama-${index}`" v-model="data.nama" trim></b-form-input>
                                        </b-form-group>
                                    </div>

                                    <div class="col-md-4">
                                        <b-form-group id="input-date" label="Tanggal Penyaluran Dana" label-for="tanggal">
                                            <b-form-datepicker :id="'tanggal'+index" v-model="data.tanggal" class="mb-2"></b-form-datepicker>
                                        </b-form-group>
                                    </div>
                                    <div class="col-md-8"></div>

                                    <div class="col-md-5">
                                        <b-form-group
                                            id="input-group-1"
                                            label="Jumlah Dana Yang Disalurkan"
                                            label-for="dana"
                                        >
                                            <b-form-input
                                            :id="`dana${index}`"
                                            v-model="data.jumlah_dana"
                                            placeholder="Rp. "
                                            required
                                            type="text"
                                            :formatter="numberFormat"
                                            v-on:keyup="penguranganSaldo"
                                            v-on:keydown="penguranganSaldo"
                                            ></b-form-input>
                                            <div>
                                                Sisa dana yang belum disalurkan 
                                                {{
                                                    ' Rp. '+formatPriceSisa(saldo, index) 
                                                }}
                                            </div>
                                        </b-form-group>
                                    </div>
                                    <div class="col-md-7"></div>

                                    <div class="col-md-4">
                                        <b-form-group
                                        :id="`fieldset-${index}`"
                                        label="Jumlah Paket yang Disalurkan"
                                        label-for="jumlah_paket"
                                        >
                                            <b-form-input type="number" id="jumlah_paket" v-model="data.jumlah_paket" trim></b-form-input>
                                        </b-form-group>
                                    </div>

                                    <div class="col-md-12">
                                        <b-form-group label="Deskripsi" label-for="deskripsi">
                                            <b-form-textarea
                                            id="deskripsi"
                                            v-model="data.deskripsi"
                                            placeholder="Enter something..."
                                            rows="4"
                                            max-rows="6"
                                            ></b-form-textarea>
                                        </b-form-group>                                        
                                    </div>

                                    <div class="col-md-12">
                                        <b-form-file
                                        multiple
                                        v-model="data.file"
                                        :state="Boolean(data.file)"
                                        placeholder="Choose a file or drop it here..."
                                        drop-placeholder="Drop file here..."
                                        @change="onEvidenceChange(index, $event)"
                                        accept="image/jpeg, image/png"
                                        ></b-form-file>
                                        <div class="mt-3">Selected file: {{ data.file ? data.file.name : '' }}</div>
                                        <div>
                                            <b-img
                                                v-for="(df, idx) in data.evidence"
                                                :key="idx"
                                                :src="data.evidence !== null && typeof data.evidence[idx] === 'object' ? data.evidence[idx].url : data.evidence[idx]"
                                                class="border border-primary p-1"
                                                style="width: 200px; height: 200px; margin-top: 20px"
                                            >
                                            </b-img>
                                        </div>
                                        <!-- <div v-else>
                                            <b-img
                                                v-for="(df, idx) in data.evidence"
                                                :key="idx"
                                                :src="data.evidence[idx].url"
                                                class="border border-primary p-1"
                                                style="width: 200px; height: 200px; margin-top: 20px"
                                            >
                                            </b-img>
                                        </div> -->
                                    </div>
                                    
                                </b-card-body>
                            </b-collapse>
                        </b-card>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <b-button @click="tambahForm()" variant="danger" style="width:100%; margin-top: 15px">+ Tambah Distribution Point</b-button>
                    </div>
                </div>

                <div class="row justify-content-center">
                    <div class="col-md-2 align-self-center">
                        <b-dropdown
                            split
                            split-variant="outline-primary"
                            variant="primary"
                            text="Save"
                            class="dropdown-custom"
                        >
                            <b-dropdown-item @click="saveData('draft')" href="#">Save as Draft</b-dropdown-item>
                            <b-dropdown-item @click="saveData('final')" href="#">Save & Finalize</b-dropdown-item>
                        </b-dropdown>
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
            dataAgen: undefined,
            isLoading: false,
            form:[
                {
                    jenis: undefined,
                    nama: undefined,
                    tanggal: undefined,
                    jumlah_dana: undefined,
                    jumlah_paket: undefined,
                    deskripsi: undefined,
                    file: [],
                    evidence: []
                }
            ],
            jenis_distribution: [
                {id:1, name:'Warteg'},
                {id:2, name:'Masjid'},
                {id:3, name:'Distribusi Langsung'},
                {id:4, name:'Lain-lain'}
            ],
            total_form: 1,
            isUpdate: false,
            saldo: undefined,
            sisa_saldo: undefined,
        }
    },
    created(){
        if(!this.$auth.loggedIn){
            this.$router.push('/login');
        }
    },
    mounted(){
        this.getDataRekap()
    },
    computed: {
        state() {
            for (let index = 0; index < this.form.length; index++) {
                return this.form[index].nama > 0
            }
            
            // return this.name.length >= 4
        },
        invalidFeedback() {
            for (let index = 0; index < this.form.length; index++) {
                console.log(this.form[index].nama)
                if(this.form[index].nama !== undefined && this.form[index].nama.length < 1){
                    return 'Please enter something.'
                }
            }
            // return console.log('idx')
            // if (this.name.length > 0) {
            // return 'Enter at least 4 characters.'
            // }
            // return 'Please enter something.'
        }
    },
    methods: {
        getDataRekap(){
            this.isLoading = true
            const token = this.$auth.strategy.token.get()
            const config = {
                headers: { Authorization: `${token}` },
            }
            this.$axios.$get(`distribution/${this.$route.query.id}`, config).then(response => {
                this.dataAgen = response;
                let arrDist = [];
                let jumlahPengurangan = 0
                if(response.outcome_distribution_points.length !== 0){
                    response.outcome_distribution_points.forEach(function (k, v){
                        arrDist.push({
                            id: k.id,
                            jenis: k.distribution_type_id,
                            nama: k.nama_point,
                            tanggal: k.tanggal,
                            jumlah_dana: 'Rp. '+(k.jumlah_dana/1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                            jumlah_paket: k.jumlah_paket,
                            deskripsi: k.deskripsi,
                            evidence: k.outcome_distribution_point_evidences
                        })

                        jumlahPengurangan += k.jumlah_dana
                        // k.outcome_distribution_point_evidences.forEach(response => {
                        //     // console.log(response)
                        //     arrDist.evidence.push([response])
                        // })
                        // k.outcome_distribution_point_evidence.forEach(function (vv, kk){
                        //     console.log(vv.url)
                        // })
                    })
                    this.saldo = response.nominal-jumlahPengurangan
                    this.form = arrDist
                    this.isUpdate = true
                }else{
                    this.saldo = response.nominal
                }
                this.isLoading = false
                // console.log(this.dataAgen)
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
        formatPriceSisa(value, idx) {    
            let val = (value/1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },

        penguranganSaldo (){
            // let jumlahDana = this.form[idx].jumlah_dana.replace(/\D+/g, "")
            let isSaldo = this.dataAgen.nominal
            let jumlahPengurangan = 0
            // console.log('jumlah donasi '+jumlahDana)
            // console.log('saldo '+this.saldo)
            for (let index = 0; index < this.form.length; index++) {
                let jumlahDana = 0
                if(this.form[index].jumlah_dana != undefined || this.form[index].jumlah_dana != null){
                    jumlahDana = this.form[index].jumlah_dana.replace(/\D+/g, "")
                }

                jumlahPengurangan += parseInt(jumlahDana);

            }
            this.saldo = isSaldo - jumlahPengurangan
        },

        numberFormat(value) {
            this.points = Number(value.replace(/\D/g, ''))
            return value == '0' ? '' : 'Rp. '+this.points.toLocaleString();
        },
        tambahForm(){
            this.form.push({
                    jenis: undefined,
                    nama: undefined,
                    tanggal: undefined,
                    jumlah_dana: undefined,
                    jumlah_paket: undefined,
                    deskripsi: undefined,
                    file: [],
                    evidence: []
                })
        },
        saveData(type){
            
            const token = this.$auth.strategy.token.get()
            const config = {
                headers: { Authorization: `${token}` },
            }

            let isUpdate = this.isUpdate

            const formData = new FormData()
            this.form.forEach(function (k, v) {
                if(isUpdate){
                    formData.append(`distribution_points[${v}][id]`, k.id)
                    formData.append(`distribution_points[${v}][jumlah_dana]`, k.jumlah_dana.split(',')[0].replace(/\D+/g, ""))
                }else{
                    formData.append(`distribution_points[${v}][jumlah_dana]`, k.jumlah_dana.replace(/\D+/g, ""))
                }
                formData.append(`distribution_points[${v}][distribution_type_id]`, k.jenis)
                formData.append(`distribution_points[${v}][nama_point]`, k.nama)
                formData.append(`distribution_points[${v}][tanggal]`, k.tanggal)
                
                formData.append(`distribution_points[${v}][jumlah_paket]`, k.jumlah_paket)
                formData.append(`distribution_points[${v}][deskripsi]`, k.deskripsi)
                if(k.file != undefined){
                    for (let index = 0; index < k.file.length; index++) {
                        console.log(k.file[index])
                        formData.append(`distribution_points[${v}][evidence][${index}][file]`, k.file[index])
                    }
                }
            });
            
            formData.append(`distribution_status`, type == 'draft' ? 0 : 1)
            if(this.isUpdate){
                this.$axios.$post(`distribution/${this.$route.query.id}/distribution-point/do-update`, formData, config)
                .then((data) => {
                    
                    if(data.success){
                        this.$bvToast.toast(`Distribution Point Sukses`, {
                            title: 'Update',
                            autoHideDelay: 5000,
                            appendToast: true,
                            variant: 'success',
                        })
                        this.$router.push('/agen/kelola-donasi');
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
            }else{
                this.$axios.$post(`distribution/${this.$route.query.id}/distribution-point`, formData, config)
                .then((data) => {
                    
                    if(data.success){
                        this.$bvToast.toast(`Distribution Point Sukses`, {
                            title: 'Save',
                            autoHideDelay: 5000,
                            appendToast: true,
                            variant: 'success',
                        })
                        this.$router.push('/agen/kelola-donasi');
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
            }
        },
        onEvidenceChange(index, e) {
            this.form[index].change = true
            const file = e.target.files
            let listFile = []
            let listEvidence = []
            
            // if(this.isUpdate){
            //     for (let idx = 0; idx < this.form[index].evidence.length; idx++) {
            //         listEvidence.push(this.form[index].evidence[idx])
            //     }                
            // }
            file.forEach(function(v, k) {
                listFile.push(v)
                listEvidence.push(URL.createObjectURL(v))
            })
            this.form[index].evidence = listEvidence
            console.log(this.form)
            this.form[index].file = listFile
        },
    },
}
</script>

<style>
.btn.accord {
    overflow-anchor: none;
    background: #e42312;
    border-color: #e42312;
    text-align: left;
}
</style>