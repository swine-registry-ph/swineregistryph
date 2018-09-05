<template>
    <div class="col s10 offset-s1">

        <div class="col s12">
            <h4 class="title-page"> Register Genetic Information </h4>
        </div>

        <div class="col s12">
            <div class="card col s12">
                <div class="card-content">
                    <span class="card-title center-align"> Genetic Information </span>
                    <div class="row">
                        <!-- General info -->
                        <div class="col s12 m6 l4 offset-m3 offset-l4">
                            <div class="col s12">
                                <br>
                            </div>

                            <!-- Laboratory Result No. -->
                            <div class="col s12 input-field">
                                <input id="lab-result-no"
                                    type="text"
                                    class="validate"
                                >
                                <label for="lab-result-no">Laboratory Result No.</label>
                            </div>

                            <!-- Animal ID -->
                            <div class="col s12 input-field">
                                <input id="animal-id"
                                    type="text"
                                    class="validate"
                                >
                                <label for="animal-id">Animal ID</label>
                            </div>

                            <!-- Sex -->
                            <div class="col s12 input-field">
                                <input id="sex"
                                    type="text"
                                    class="validate"
                                >
                                <label for="sex">Sex</label>
                            </div>

                            <!-- Farm -->
                            <div class="col s12 input-field">
                                <input id="farm"
                                    type="text"
                                    class="validate"
                                >
                                <label for="farm">Farm</label>
                            </div>

                            <!-- Date of Result -->
                            <div class="col s12 input-field">
                                <app-input-date
                                    v-model="recordInfoData.dateResult"
                                    @date-select="val => {recordInfoData.dateResult = val}"
                                >
                                </app-input-date>
                                <label for="">Date of Result</label>
                            </div>

                            <!-- Date Submitted -->
                            <div class="col s12 input-field">
                                <app-input-date
                                    v-model="recordInfoData.dateSubmission"
                                    @date-select="val => {recordInfoData.dateSubmission = val}"
                                >
                                </app-input-date>
                                <label for="">Date of Submission</label>
                            </div>

                            <div class="col s12">
                                <br>
                            </div>

                        </div>

                        <!-- Other Traits -->
                        <div class="col s12">
                            <ul class="collapsible z-depth-0" data-collapsible="expandable">
                                <li>
                                    <!-- Fertility Traits -->
                                    <div class="collapsible-header">
                                        <i class="material-icons left">label</i>
                                        <b>Fertility Traits</b>
                                    </div>
                                    <div class="collapsible-body">
                                        <div class="row">
                                            <!-- ESR Results -->
                                            <div class="col s12">
                                                <div class="col s5 m3">
                                                    <p class="padded">
                                                        <input v-model="showChoices.esr"
                                                            type="checkbox" 
                                                            id="esr-checkbox" 
                                                            class="filled-in" 
                                                        />
                                                        <label for="esr-checkbox" class="black-text"><b>ESR</b> (BB)*</label>
                                                    </p>
                                                </div>
                                                <div class="col s7 m9">
                                                    <div v-show="showChoices.esr">
                                                        <p class="padded">
                                                            <input name="esr" type="radio" id="esr-1" />
                                                            <label for="esr-1">BB</label>
                                                            <input name="esr" type="radio" id="esr-2" />
                                                            <label for="esr-2">Bb</label>
                                                            <input name="esr" type="radio" id="esr-3" />
                                                            <label for="esr-3">bb</label>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- PRLR Results -->
                                            <div class="col s12">
                                                <div class="col s5 m3">
                                                    <p class="padded">
                                                        <input v-model="showChoices.prlr"
                                                            type="checkbox" 
                                                            id="prlr-checkbox" 
                                                            class="filled-in" 
                                                        />
                                                        <label for="prlr-checkbox" class="black-text"><b>PRLR</b> (AA)*</label>
                                                    </p>
                                                </div>
                                                <div class="col s7 m9">
                                                    <div v-show="showChoices.prlr">
                                                        <p class="padded">
                                                            <input name="prlr" type="radio" id="prlr-1" />
                                                            <label for="prlr-1">AA</label>
                                                            <input name="prlr" type="radio" id="prlr-2" />
                                                            <label for="prlr-2">Aa</label>
                                                            <input name="prlr" type="radio" id="prlr-3" />
                                                            <label for="prlr-3">aa</label>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- RBP4 Results -->
                                            <div class="col s12">
                                                <div class="col s5 m3">
                                                    <p class="padded">
                                                        <input v-model="showChoices.rbp4"
                                                            type="checkbox" 
                                                            id="rbp4-checkbox" 
                                                            class="filled-in" 
                                                        />
                                                        <label for="rbp4-checkbox" class="black-text"><b>RBP4</b> (BB)*</label>
                                                    </p>
                                                </div>
                                                <div class="col s7 m9">
                                                    <div v-show="showChoices.rbp4">
                                                        <p class="padded">
                                                            <input name="rbp4" type="radio" id="rbp4-1" />
                                                            <label for="rbp4-2">BB</label>
                                                            <input name="rbp4" type="radio" id="rbp4-2" />
                                                            <label for="rbp4-2">Bb</label>
                                                            <input name="rbp4" type="radio" id="rbp4-3" />
                                                            <label for="rbp4-3">bb</label>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- LIF Results -->
                                            <div class="col s12">
                                                <div class="col s5 m3">
                                                    <p class="padded">
                                                        <input v-model="showChoices.lif"
                                                            type="checkbox" 
                                                            id="lif-checkbox" 
                                                            class="filled-in" 
                                                        />
                                                        <label for="lif-checkbox" class="black-text"><b>LIF</b> (BB)*</label>
                                                    </p>
                                                </div>
                                                <div class="col s7 m9">
                                                    <div v-show="showChoices.lif">
                                                        <p class="padded">
                                                            <input name="lif" type="radio" id="lif-1" />
                                                            <label for="lif-1">BB</label>
                                                            <input name="lif" type="radio" id="lif-2" />
                                                            <label for="lif-2">Bb</label>
                                                            <input name="lif" type="radio" id="lif-3" />
                                                            <label for="lif-3">bb</label>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <!-- Meat Quality and Growth Rate -->
                                    <div class="collapsible-header">
                                        <i class="material-icons left">label</i>
                                        <b>Meat Quality and Growth Rate</b>
                                    </div>
                                    <div class="collapsible-body">
                                        <div class="row">
                                            <!-- HFABP Results -->
                                            <div class="col s12">
                                                <div class="col s5 m3">
                                                    <p class="padded">
                                                        <input v-model="showChoices.hfabp"
                                                            type="checkbox" 
                                                            id="hfabp-checkbox" 
                                                            class="filled-in" 
                                                        />
                                                        <label for="hfabp-checkbox" class="black-text"><b>HFABP</b> (AA)*</label>
                                                    </p>
                                                </div>
                                                <div class="col s7 m9">
                                                    <div v-show="showChoices.hfabp">
                                                        <p class="padded">
                                                            <input name="hfabp" type="radio" id="hfabp-1" />
                                                            <label for="hfabp-1">AA</label>
                                                            <input name="hfabp" type="radio" id="hfabp-2" />
                                                            <label for="hfabp-2">Aa</label>
                                                            <input name="hfabp" type="radio" id="hfabp-3" />
                                                            <label for="hfabp-3">aa</label>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- IGF2 Results -->
                                            <div class="col s12">
                                                <div class="col s5 m3">
                                                    <p class="padded">
                                                        <input v-model="showChoices.igf2"
                                                            type="checkbox" 
                                                            id="igf2-checkbox" 
                                                            class="filled-in" 
                                                        />
                                                        <label for="igf2-checkbox" class="black-text"><b>IGF2</b> (CC)*</label>
                                                    </p>
                                                </div>
                                                <div class="col s7 m9">
                                                    <div v-show="showChoices.igf2">
                                                        <p class="padded">
                                                            <input name="igf2" type="radio" id="igf2-1" />
                                                            <label for="igf2-1">CC</label>
                                                            <input name="igf2" type="radio" id="igf2-2" />
                                                            <label for="igf2-2">Cc</label>
                                                            <input name="igf2" type="radio" id="igf2-3" />
                                                            <label for="igf2-3">cc</label>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- LEPR Results -->
                                            <div class="col s12">
                                                <div class="col s5 m3">
                                                    <p class="padded">
                                                        <input v-model="showChoices.lepr"
                                                            type="checkbox" 
                                                            id="lepr-checkbox" 
                                                            class="filled-in" 
                                                        />
                                                        <label for="lepr-checkbox" class="black-text"><b>LEPR</b> (BB)*</label>
                                                    </p>
                                                </div>
                                                <div class="col s7 m9">
                                                    <div v-show="showChoices.lepr">
                                                        <p class="padded">
                                                            <input name="lepr" type="radio" id="lepr-1" />
                                                            <label for="lepr-1">BB</label>
                                                            <input name="lepr" type="radio" id="lepr-2" />
                                                            <label for="lepr-2">Bb</label>
                                                            <input name="lepr" type="radio" id="lepr-3" />
                                                            <label for="lepr-3">bb</label>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- MYOG Results -->
                                            <div class="col s12">
                                                <div class="col s5 m3">
                                                    <p class="padded">
                                                        <input v-model="showChoices.myog"
                                                            type="checkbox" 
                                                            id="myog-checkbox" 
                                                            class="filled-in" 
                                                        />
                                                        <label for="myog-checkbox" class="black-text"><b>MYOG</b> (AA)*</label>
                                                    </p>
                                                </div>
                                                <div class="col s7 m9">
                                                    <div v-show="showChoices.myog">
                                                        <p class="padded">
                                                            <input name="myog" type="radio" id="myog-1" />
                                                            <label for="myog-1">AA</label>
                                                            <input name="myog" type="radio" id="myog-2" />
                                                            <label for="myog-2">Aa</label>
                                                            <input name="myog" type="radio" id="myog-3" />
                                                            <label for="myog-3">aa</label>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <!-- Genetic Defects -->
                                    <div class="collapsible-header">
                                        <i class="material-icons left">label</i>
                                        <b>Genetic Defects</b>
                                    </div>
                                    <div class="collapsible-body">
                                        <div class="row">
                                            <!-- PSS Results -->
                                            <div class="col s12">
                                                <div class="col s5 m3">
                                                    <p class="padded">
                                                        <input v-model="showChoices.pss"
                                                            type="checkbox" 
                                                            id="pss-checkbox" 
                                                            class="filled-in" 
                                                        />
                                                        <label for="pss-checkbox" class="black-text"><b>PSS</b> (Negative)*</label>
                                                    </p>
                                                </div>
                                                <div class="col s7 m9">
                                                    <div v-show="showChoices.pss">
                                                        <p class="padded">
                                                            <input name="pss" type="radio" id="pss-1" />
                                                            <label for="pss-1">Positive</label>
                                                            <input name="pss" type="radio" id="pss-2" />
                                                            <label for="pss-2">Negative</label>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- RN Results -->
                                            <div class="col s12">
                                                <div class="col s5 m3">
                                                    <p class="padded">
                                                        <input v-model="showChoices.rn"
                                                            type="checkbox" 
                                                            id="rn-checkbox" 
                                                            class="filled-in" 
                                                        />
                                                        <label for="rn-checkbox" class="black-text"><b>RN</b> (Negative)*</label>
                                                    </p>
                                                </div>
                                                <div class="col s7 m9">
                                                    <div v-show="showChoices.rn">
                                                        <p class="padded">
                                                            <input name="rn" type="radio" id="rn-1" />
                                                            <label for="rn-1">Positive</label>
                                                            <input name="rn" type="radio" id="rn-2" />
                                                            <label for="rn-2">Negative</label>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- BAX Results -->
                                            <div class="col s12">
                                                <div class="col s5 m3">
                                                    <p class="padded">
                                                        <input v-model="showChoices.bax"
                                                            type="checkbox" 
                                                            id="bax-checkbox" 
                                                            class="filled-in" 
                                                        />
                                                        <label for="bax-checkbox" class="black-text"><b>BAX</b> (Negative)*</label>
                                                    </p>
                                                </div>
                                                <div class="col s7 m9">
                                                    <div v-show="showChoices.bax">
                                                        <p class="padded">
                                                            <input name="bax" type="radio" id="bax-1" />
                                                            <label for="bax-1">Positive</label>
                                                            <input name="bax" type="radio" id="bax-2" />
                                                            <label for="bax-2">Negative</label>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <!-- Diseases Resistance -->
                                    <div class="collapsible-header">
                                        <i class="material-icons left">label</i>
                                        <b>Diseases Resistance</b>
                                    </div>
                                    <div class="collapsible-body">
                                        <div class="row">
                                            <!-- FUT1 Results -->
                                            <div class="col s12">
                                                <div class="col s5 m3">
                                                    <p class="padded">
                                                        <input v-model="showChoices.fut1"
                                                            type="checkbox" 
                                                            id="fut1-checkbox" 
                                                            class="filled-in" 
                                                        />
                                                        <label for="fut1-checkbox" class="black-text"><b>FUT1</b> (AA)*</label>
                                                    </p>
                                                </div>
                                                <div class="col s7 m9">
                                                    <div v-show="showChoices.fut1">
                                                        <p class="padded">
                                                            <input name="fut1" type="radio" id="fut1-1" />
                                                            <label for="fut1-1">AA</label>
                                                            <input name="fut1" type="radio" id="fut1-2" />
                                                            <label for="fut1-2">Aa</label>
                                                            <input name="fut1" type="radio" id="fut1-3" />
                                                            <label for="fut1-3">aa</label>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- MX1 Results -->
                                            <div class="col s12">
                                                <div class="col s5 m3">
                                                    <p class="padded">
                                                        <input v-model="showChoices.mx1"
                                                            type="checkbox" 
                                                            id="mx1-checkbox" 
                                                            class="filled-in" 
                                                        />
                                                        <label for="mx1-checkbox" class="black-text"><b>MX1</b> (Resistant)*</label>
                                                    </p>
                                                </div>
                                                <div class="col s7 m9">
                                                    <div v-show="showChoices.mx1">
                                                        <p class="padded">
                                                            <input name="mx1" type="radio" id="mx1-1" />
                                                            <label for="mx1-1">Resistant</label>
                                                            <input name="mx1" type="radio" id="mx1-2" />
                                                            <label for="mx1-2">Non-resistant</label>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- NRAMP Results -->
                                            <div class="col s12">
                                                <div class="col s5 m3">
                                                    <p class="padded">
                                                        <input v-model="showChoices.nramp"
                                                            type="checkbox" 
                                                            id="nramp-checkbox" 
                                                            class="filled-in" 
                                                        />
                                                        <label for="nramp-checkbox" class="black-text"><b>NRAMP</b> (BB)*</label>
                                                    </p>
                                                </div>
                                                <div class="col s7 m9">
                                                    <div v-show="showChoices.nramp">
                                                        <p class="padded">
                                                            <input name="nramp" type="radio" id="nramp-1" />
                                                            <label for="nramp-1">BB</label>
                                                            <input name="nramp" type="radio" id="nramp-2" />
                                                            <label for="nramp-2">Bb</label>
                                                            <input name="nramp" type="radio" id="nramp-3" />
                                                            <label for="nramp-3">bb</label>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- BPI Results -->
                                            <div class="col s12">
                                                <div class="col s5 m3">
                                                    <p class="padded">
                                                        <input v-model="showChoices.bpi"
                                                            type="checkbox" 
                                                            id="bpi-checkbox" 
                                                            class="filled-in" 
                                                        />
                                                        <label for="bpi-checkbox" class="black-text"><b>BPI</b> (GG)*</label>
                                                    </p>
                                                </div>
                                                <div class="col s7 m9">
                                                    <div v-show="showChoices.bpi">
                                                        <p class="padded">
                                                            <input name="bpi" type="radio" id="bpi-1" />
                                                            <label for="bpi-1">GG</label>
                                                            <input name="bpi" type="radio" id="bpi-2" />
                                                            <label for="bpi-2">Gg</label>
                                                            <input name="bpi" type="radio" id="bpi-3" />
                                                            <label for="bpi-3">gg</label>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>

                <div class="card-action center-align">
                    <!-- Record Button -->
                    <button class="btn">
                        Record
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                showChoices: {
                    esr: false,
                    prlr: false,
                    rbp4: false,
                    lif: false,
                    hfabp: false,
                    igf2: false,
                    lepr: false,
                    myog: false,
                    pss: false,
                    rn: false,
                    bax: false,
                    fut1: false,
                    mx1: false,
                    nramp: false,
                    bpi: false
                },
                recordInfoData: {
                    dateResult: '',
                    dateSubmission: ''
                }
            }
        },

        methods: {

        },

        mounted() {
            // Materialize component initializations
            $('.collapsible').collapsible();
        }
    }
</script>

<style scoped>
    p.padded {
        padding-top: 1rem;
        padding-bottom: 1rem;
    }

    p.padded label {
        padding-right: 2rem;
    }

    /* Card Customizations */
    .card {
        padding: 0;
    }

    div.card-action {
        border-top: 0;
        background-color: rgba(236, 239, 241, 0.7);
    }

</style>
