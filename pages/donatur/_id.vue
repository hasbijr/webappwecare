<template>
    <div>
        <b-container fluid="md" style="margin-top: 25px">
            <b-card class="center col-sm-10">
                <div class="text-center label-create-campaign">Formulir Donatur</div>
                <div class="text-center" style="margin-bottom: 10px">Petunjuk untuk data donatur Petunjuk untuk data donatur Petunjuk untuk data donatur Petunjuk untuk data donatur Petunjuk untuk data donatur</div>
                <b-card class="center col-sm-12">
                    <b-form @submit="onSubmit" v-if="show">
                        <b-form-group id="nama" label="Nama Donatur:" label-for="nama_donatur" class="text-left">
                            <b-form-input id="nama_donatur" v-model="form.nama_donatur" type="text" placeholder="Nama Donatur" required></b-form-input>
                        </b-form-group>
                        
                        <b-row>
                            <b-col>
                                <b-form-group id="nik" label="NIK Donatur:" label-for="password" class="text-left">
                                    <!-- <label for="example-datepicker">Choose a date</label> -->
                                    <b-form-input id="nik" v-model="form.nik_donatur" class="mb-2"></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <b-form-group id="no_hp" label="No Hp Donatur (LinkAja):" label-for="password" class="text-left">
                                    <!-- <label for="example-datepicker">Choose a date</label> -->
                                    <b-form-input id="no_hp" v-model="form.no_hp" class="mb-2"></b-form-input>
                                    <label for="" style="font-size: 10px">
                                        * Nomor HP yang dituliskan harus sama dengan nomor HP yang terdaftar di aplikasi LinkAja
                                    </label>
                                </b-form-group>
                            </b-col>
                        </b-row>

                        <b-form-group id="label-qa" label-for="syarat" class="text-center">
                            <b-form-checkbox
                            id="qa"
                            v-model="form.qa"
                            name="qa"
                            value="accepted"
                            unchecked-value="not_accepted"
                            >
                            Saya menyetujui Syarat & Ketentuan yang berlaku
                            </b-form-checkbox>
                        </b-form-group>

                        <b-button type="submit" class="btn-login col-sm-3" style="left:50%; " variant="primary">Simpan</b-button>
                    </b-form>
                </b-card>
            </b-card>
        </b-container>
    </div>
</template>

<script>
export default {
    layout: 'navbar',
    data() {
        const example1 = {
        };
        const example2 = {
        };
        const example3 = {
        };
        const items = [example1, example2, example3];

        return { 
            items, 
            form: {
                nama: '',
                nik_donatur: '',
                no_hp: '',
                agreement: false
                // checked: false
            },
            show: true,
            
        };
    },
    created: function() {
        console.log(this.$auth.loggedIn);
    },
    methods: {
        onSubmit(event) {
            event.preventDefault()
            alert(JSON.stringify(this.form))
        },
    }
}
</script>

<style>
.background-custom{
    background-color: #FFFFFF !important;
}
</style>