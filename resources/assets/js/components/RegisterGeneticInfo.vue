<template lang="html">
    <div class="col s10 offset-s1">

        <div class="col s12">
            <h4 class="title-page"> Register Laboratory Results </h4>
        </div>

        <div class="row" style="margin-bottom:0;">
            <div id="add-lab-result-tabs" class="col s12" style="margin-top:2rem; padding:0;">
                <ul class="tabs tabs-fixed-width z-depth-2">
                    <li class="tab col s6"><a href="#general-information">General Information</a></li>
                    <li class="tab col s6"><a href="#genetic-information">Genetic Information</a></li>
                </ul>
            </div>
        </div>

        <!-- General Information tab -->
        <div id="general-information" class="row">
            <div class="card col s12">
                <div class="card-content">
                    <span class="card-title center-align"> General Information </span>
                    <div class="row">
                        <!-- General info -->
                        <div class="col s12 m6 l4 offset-m3 offset-l4">
                            <div class="col s12">
                                <br>
                            </div>

                            <!-- Laboratory Result No. -->
                            <div class="col s12 input-field">
                                <input v-model="recordInfoData.laboratoryResultNo"
                                    id="lab-result-no"
                                    type="text"
                                    class="validate"
                                >
                                <label for="lab-result-no">Laboratory Result No.</label>
                            </div>

                            <!-- Animal ID -->
                            <div class="col s12 input-field">
                                <input v-model="recordInfoData.animalId"
                                    id="animal-id"
                                    type="text"
                                    class="validate"
                                >
                                <label for="animal-id">Animal ID</label>
                            </div>

                            <!-- Sex -->
                            <div class="col s12 input-field">
                                <app-input-select
                                    labelDescription="Sex"
                                    v-model="recordInfoData.sex"
                                    :options="[{text:'Male', value:'male'}, {text:'Female', value:'female'}]"
                                    @select="val => {recordInfoData.sex = val}"
                                >
                                </app-input-select>
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
                                    @date-select="val => {recordInfoData.dateSubmitted = val}"
                                >
                                </app-input-date>
                                <label for="">Date Submitted</label>
                            </div>

                            <div class="col s12">
                                <br>
                            </div>

                            <div class="col s12">
                                <h6>
                                    <b>Is Farm reigstered in the system?</b>
                                </h6>
                                <p>
                                    <input v-model="showChoices.farm"
                                        name="yes"
                                        type="radio"
                                        id="yes"
                                        value="registered"
                                    >
                                    <label for="yes">Yes</label>
                                </p>
                                <p>
                                    <input v-model="showChoices.farm"
                                        name="no"
                                        type="radio"
                                        id="no"
                                        value="not-registered"
                                    >
                                    <label for="no">No</label>
                                </p>
                            </div>

                            <div class="col s12">
                                <br>
                            </div>

                            <!-- Exsiting Farm -->
                            <div v-show="showChoices.farm === 'registered'" class="col s12 input-field">
                                <app-input-select
                                    labelDescription="Farm Of Origin"
                                    v-model="recordInfoData.farmId"
                                    :options="farmoptions"
                                    @select="val => {recordInfoData.farmId = val}"
                                >
                                </app-input-select>
                            </div>

                            <!-- Not yet registered Farm -->
                            <div v-show="showChoices.farm === 'not-registered'" class="col s12 input-field">
                                <input v-model="recordInfoData.farmName"
                                    id="farm-name"
                                    type="text"
                                    class="validate"
                                >
                                <label for="farm-name">Farm Name</label>
                            </div>

                            <div class="col s12">
                                <br>
                            </div>

                        </div>

                        <!-- Tab navigatoin links -->
                        <div class="col s12">
                            <a class="btn-floating btn-large waves-effect waves-light blue right"
                                @click.prevent="goToTab('genetic-information')"
                            >
                                <i class="material-icons">arrow_forward</i>
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <!-- Genetic Information tab -->
        <div id="genetic-information" class="row">
            <div class="card col s12">
                <div class="card-content">
                    <span class="card-title center-align"> Genetic Information </span>

                    <div class="row">
                        <div class="col s12">
                            <blockquote class="info">
                                * &nbsp; - &nbsp; Favorable genotype
                            </blockquote>
                            <br>
                        </div>
                        <!-- Fertility Traits Card -->
                        <div id="fertility-container" class="col s12 m6">
                            <div class="card col s12 card-traits-container">
                                <div class="card-content">
                                    <h6 class="center-align">
                                        <b>Fertility Traits</b>
                                    </h6>

                                    <!-- ESR Results -->
                                    <div class="col s12">
                                        <div class="col s5 m5">
                                            <p class="padded">
                                                <input v-model="showChoices.esr"
                                                    type="checkbox" 
                                                    id="esr-checkbox" 
                                                    class="filled-in" 
                                                />
                                                <label for="esr-checkbox" class="black-text"><b>ESR</b> (BB)*</label>
                                            </p>
                                        </div>
                                        <div class="col s7 m7">
                                            <div v-show="showChoices.esr">
                                                <p class="padded">
                                                    <template v-for="(choice, index) in testChoices.esr">
                                                        <input v-model="recordInfoData.tests.esr" 
                                                            name="esr" 
                                                            type="radio" 
                                                            :id="`esr-${index}`"
                                                            :value="choice" 
                                                        />
                                                        <label :for="`esr-${index}`"> {{choice}} </label>
                                                    </template>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- PRLR Results -->
                                    <div class="col s12">
                                        <div class="col s5 m5">
                                            <p class="padded">
                                                <input v-model="showChoices.prlr"
                                                    type="checkbox" 
                                                    id="prlr-checkbox" 
                                                    class="filled-in" 
                                                />
                                                <label for="prlr-checkbox" class="black-text"><b>PRLR</b> (AA)*</label>
                                            </p>
                                        </div>
                                        <div class="col s7 m7">
                                            <div v-show="showChoices.prlr">
                                                <p class="padded">
                                                    <template v-for="(choice, index) in testChoices.prlr">
                                                        <input v-model="recordInfoData.tests.prlr" 
                                                            name="prlr" 
                                                            type="radio" 
                                                            :id="`prlr${index}`"
                                                            :value="choice" 
                                                        />
                                                        <label :for="`prlr${index}`"> {{choice}} </label>
                                                    </template>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- RBP4 Results -->
                                    <div class="col s12">
                                        <div class="col s5 m5">
                                            <p class="padded">
                                                <input v-model="showChoices.rbp4"
                                                    type="checkbox" 
                                                    id="rbp4-checkbox" 
                                                    class="filled-in" 
                                                />
                                                <label for="rbp4-checkbox" class="black-text"><b>RBP4</b> (BB)*</label>
                                            </p>
                                        </div>
                                        <div class="col s7 m7">
                                            <div v-show="showChoices.rbp4">
                                                <p class="padded">
                                                    <template v-for="(choice, index) in testChoices.rbp4">
                                                        <input v-model="recordInfoData.tests.rbp4" 
                                                            name="rbp4" 
                                                            type="radio" 
                                                            :id="`rbp4-${index}`"
                                                            :value="choice" 
                                                        />
                                                        <label :for="`rbp4-${index}`"> {{choice}} </label>
                                                    </template>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- LIF Results -->
                                    <div class="col s12">
                                        <div class="col s5 m5">
                                            <p class="padded">
                                                <input v-model="showChoices.lif"
                                                    type="checkbox" 
                                                    id="lif-checkbox" 
                                                    class="filled-in" 
                                                />
                                                <label for="lif-checkbox" class="black-text"><b>LIF</b> (BB)*</label>
                                            </p>
                                        </div>
                                        <div class="col s7 m7">
                                            <div v-show="showChoices.lif">
                                                <p class="padded">
                                                    <template v-for="(choice, index) in testChoices.lif">
                                                        <input v-model="recordInfoData.tests.lif" 
                                                            name="lif" 
                                                            type="radio" 
                                                            :id="`lif-${index}`"
                                                            :value="choice" 
                                                        />
                                                        <label :for="`lif-${index}`"> {{choice}} </label>
                                                    </template>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Meat Quality and Growth Rate Card -->
                        <div id="meat-and-growth-container" class="col s6">
                            <div class="card col s12 card-traits-container">
                                <div class="card-content">
                                    <h6 class="center-align">
                                        <b>Meat Quality and Growth Rate</b>
                                    </h6>

                                    <!-- HFABP Results -->
                                    <div class="col s12">
                                        <div class="col s5 m5">
                                            <p class="padded">
                                                <input v-model="showChoices.hfabp"
                                                    type="checkbox" 
                                                    id="hfabp-checkbox" 
                                                    class="filled-in" 
                                                />
                                                <label for="hfabp-checkbox" class="black-text"><b>HFABP</b> (AA)*</label>
                                            </p>
                                        </div>
                                        <div class="col s7 m7">
                                            <div v-show="showChoices.hfabp">
                                                <p class="padded">
                                                    <template v-for="(choice, index) in testChoices.hfabp">
                                                        <input v-model="recordInfoData.tests.hfabp" 
                                                            name="hfabp" 
                                                            type="radio" 
                                                            :id="`hfabp-${index}`"
                                                            :value="choice" 
                                                        />
                                                        <label :for="`hfabp-${index}`"> {{choice}} </label>
                                                    </template>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- IGF2 Results -->
                                    <div class="col s12">
                                        <div class="col s5 m5">
                                            <p class="padded">
                                                <input v-model="showChoices.igf2"
                                                    type="checkbox" 
                                                    id="igf2-checkbox" 
                                                    class="filled-in" 
                                                />
                                                <label for="igf2-checkbox" class="black-text"><b>IGF2</b> (CC)*</label>
                                            </p>
                                        </div>
                                        <div class="col s7 m7">
                                            <div v-show="showChoices.igf2">
                                                <p class="padded">
                                                    <template v-for="(choice, index) in testChoices.igf2">
                                                        <input v-model="recordInfoData.tests.igf2" 
                                                            name="igf2" 
                                                            type="radio" 
                                                            :id="`igf2-${index}`"
                                                            :value="choice" 
                                                        />
                                                        <label :for="`igf2-${index}`"> {{choice}} </label>
                                                    </template>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- LEPR Results -->
                                    <div class="col s12">
                                        <div class="col s5 m5">
                                            <p class="padded">
                                                <input v-model="showChoices.lepr"
                                                    type="checkbox" 
                                                    id="lepr-checkbox" 
                                                    class="filled-in" 
                                                />
                                                <label for="lepr-checkbox" class="black-text"><b>LEPR</b> (BB)*</label>
                                            </p>
                                        </div>
                                        <div class="col s7 m7">
                                            <div v-show="showChoices.lepr">
                                                <p class="padded">
                                                    <template v-for="(choice, index) in testChoices.lepr">
                                                        <input v-model="recordInfoData.tests.lepr" 
                                                            name="lepr" 
                                                            type="radio" 
                                                            :id="`lepr-${index}`"
                                                            :value="choice" 
                                                        />
                                                        <label :for="`lepr-${index}`"> {{choice}} </label>
                                                    </template>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- MYOG Results -->
                                    <div class="col s12">
                                        <div class="col s5 m5">
                                            <p class="padded">
                                                <input v-model="showChoices.myog"
                                                    type="checkbox" 
                                                    id="myog-checkbox" 
                                                    class="filled-in" 
                                                />
                                                <label for="myog-checkbox" class="black-text"><b>MYOG</b> (AA)*</label>
                                            </p>
                                        </div>
                                        <div class="col s7 m7">
                                            <div v-show="showChoices.myog">
                                                <p class="padded">
                                                    <template v-for="(choice, index) in testChoices.myog">
                                                        <input v-model="recordInfoData.tests.myog" 
                                                            name="myog" 
                                                            type="radio" 
                                                            :id="`myog-${index}`"
                                                            :value="choice" 
                                                        />
                                                        <label :for="`myog-${index}`"> {{choice}} </label>
                                                    </template>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <!-- Genetic Defects Card -->
                        <div id="defects-container" class="col s6">
                            <div class="card col s12 card-traits-container">
                                <div class="card-content">
                                    <h6 class="center-align">
                                        <b>Genetic Defects</b>
                                    </h6>

                                    <!-- PSS Results -->
                                    <div class="col s12">
                                        <div class="col s5 m5">
                                            <p class="padded">
                                                <input v-model="showChoices.pss"
                                                    type="checkbox" 
                                                    id="pss-checkbox" 
                                                    class="filled-in" 
                                                />
                                                <label for="pss-checkbox" class="black-text"><b>PSS</b> (Negative)*</label>
                                            </p>
                                        </div>
                                        <div class="col s7 m7">
                                            <div v-show="showChoices.pss">
                                                <p class="padded">
                                                    <template v-for="(choice, index) in testChoices.pss">
                                                        <input v-model="recordInfoData.tests.pss" 
                                                            name="pss" 
                                                            type="radio" 
                                                            :id="`pss-${index}`"
                                                            :value="choice.toUpperCase()" 
                                                        />
                                                        <label :for="`pss-${index}`"> {{choice}} </label>
                                                    </template>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- RN Results -->
                                    <div class="col s12">
                                        <div class="col s5 m5">
                                            <p class="padded">
                                                <input v-model="showChoices.rn"
                                                    type="checkbox" 
                                                    id="rn-checkbox" 
                                                    class="filled-in" 
                                                />
                                                <label for="rn-checkbox" class="black-text"><b>RN</b> (Negative)*</label>
                                            </p>
                                        </div>
                                        <div class="col s7 m7">
                                            <div v-show="showChoices.rn">
                                                <p class="padded">
                                                    <template v-for="(choice, index) in testChoices.rn">
                                                        <input v-model="recordInfoData.tests.rn" 
                                                            name="rn" 
                                                            type="radio" 
                                                            :id="`rn-${index}`"
                                                            :value="choice.toUpperCase()" 
                                                        />
                                                        <label :for="`rn-${index}`"> {{choice}} </label>
                                                    </template>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- BAX Results -->
                                    <div class="col s12">
                                        <div class="col s5 m5">
                                            <p class="padded">
                                                <input v-model="showChoices.bax"
                                                    type="checkbox" 
                                                    id="bax-checkbox" 
                                                    class="filled-in" 
                                                />
                                                <label for="bax-checkbox" class="black-text"><b>BAX</b> (Negative)*</label>
                                            </p>
                                        </div>
                                        <div class="col s7 m7">
                                            <div v-show="showChoices.bax">
                                                <p class="padded">
                                                    <template v-for="(choice, index) in testChoices.bax">
                                                        <input v-model="recordInfoData.tests.bax" 
                                                            name="bax" 
                                                            type="radio" 
                                                            :id="`bax-${index}`"
                                                            :value="choice.toUpperCase()" 
                                                        />
                                                        <label :for="`bax-${index}`"> {{choice}} </label>
                                                    </template>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Diseases Resistance Card -->
                        <div id="diseases-container"class="col s6">
                            <div class="card col s12 card-traits-container">
                                <div class="card-content">
                                    <h6 class="center-align">
                                        <b>Diseases Resistance</b>
                                    </h6>

                                    <!-- FUT1 Results -->
                                    <div class="col s12">
                                        <div class="col s5 m5">
                                            <p class="padded">
                                                <input v-model="showChoices.fut1"
                                                    type="checkbox" 
                                                    id="fut1-checkbox" 
                                                    class="filled-in" 
                                                />
                                                <label for="fut1-checkbox" class="black-text"><b>FUT1</b> (AA)*</label>
                                            </p>
                                        </div>
                                        <div class="col s7 m7">
                                            <div v-show="showChoices.fut1">
                                                <p class="padded">
                                                    <template v-for="(choice, index) in testChoices.fut1">
                                                        <input v-model="recordInfoData.tests.fut1" 
                                                            name="fut1" 
                                                            type="radio" 
                                                            :id="`fut1-${index}`"
                                                            :value="choice" 
                                                        />
                                                        <label :for="`fut1-${index}`"> {{choice}} </label>
                                                    </template>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- MX1 Results -->
                                    <div class="col s12">
                                        <div class="col s5 m5">
                                            <p class="padded">
                                                <input v-model="showChoices.mx1"
                                                    type="checkbox" 
                                                    id="mx1-checkbox" 
                                                    class="filled-in" 
                                                />
                                                <label for="mx1-checkbox" class="black-text"><b>MX1</b> (Resistant)*</label>
                                            </p>
                                        </div>
                                        <div class="col s7 m7">
                                            <div v-show="showChoices.mx1">
                                                <p class="padded">
                                                    <template v-for="(choice, index) in testChoices.mx1">
                                                        <input v-model="recordInfoData.tests.mx1" 
                                                            name="mx1" 
                                                            type="radio" 
                                                            :id="`mx1-${index}`"
                                                            :value="choice.toUpperCase()" 
                                                        />
                                                        <label :for="`mx1-${index}`"> {{choice}} </label>
                                                    </template>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- NRAMP Results -->
                                    <div class="col s12">
                                        <div class="col s5 m5">
                                            <p class="padded">
                                                <input v-model="showChoices.nramp"
                                                    type="checkbox" 
                                                    id="nramp-checkbox" 
                                                    class="filled-in" 
                                                />
                                                <label for="nramp-checkbox" class="black-text"><b>NRAMP</b> (BB)*</label>
                                            </p>
                                        </div>
                                        <div class="col s7 m7">
                                            <div v-show="showChoices.nramp">
                                                <p class="padded">
                                                    <template v-for="(choice, index) in testChoices.nramp">
                                                        <input v-model="recordInfoData.tests.nramp" 
                                                            name="nramp" 
                                                            type="radio" 
                                                            :id="`nramp-${index}`"
                                                            :value="choice" 
                                                        />
                                                        <label :for="`nramp-${index}`"> {{choice}} </label>
                                                    </template>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- BPI Results -->
                                    <div class="col s12">
                                        <div class="col s5 m5">
                                            <p class="padded">
                                                <input v-model="showChoices.bpi"
                                                    type="checkbox" 
                                                    id="bpi-checkbox" 
                                                    class="filled-in" 
                                                />
                                                <label for="bpi-checkbox" class="black-text"><b>BPI</b> (GG)*</label>
                                            </p>
                                        </div>
                                        <div class="col s7 m7">
                                            <div v-show="showChoices.bpi">
                                                <p class="padded">
                                                    <template v-for="(choice, index) in testChoices.bpi">
                                                        <input v-model="recordInfoData.tests.bpi" 
                                                            name="bpi" 
                                                            type="radio" 
                                                            :id="`bpi-${index}`"
                                                            :value="choice" 
                                                        />
                                                        <label :for="`bpi-${index}`"> {{choice}} </label>
                                                    </template>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div class="card-action center-align">
                    <!-- Save Button -->
                    <button @click.prevent="saveLaboratoryResults($event)"
                        class="btn save-btn"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            farmoptions: Array
        },

        data() {
            return {
                showChoices: {
                    farm: 'registered',
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
                testChoices: {
                    esr: ['BB', 'Bb', 'bb'],
                    prlr: ['AA', 'Aa', 'aa'],
                    rbp4: ['BB', 'Bb', 'bb'],
                    lif: ['BB', 'Bb', 'bb'],
                    hfabp: ['AA', 'Aa', 'aa'],
                    igf2: ['CC', 'Cc', 'cc'],
                    lepr: ['BB', 'Bb', 'bb'],
                    myog: ['AA', 'Aa', 'aa'],
                    pss: ['Positive', 'Negative'],
                    rn: ['Positive', 'Negative'],
                    bax: ['Positive', 'Negative'],
                    fut1: ['AA', 'Aa', 'aa'],
                    mx1: ['Resistant', 'Non-resistant'],
                    nramp: ['BB', 'Bb', 'bb'],
                    bpi: ['GG', 'Gg', 'gg']

                },
                recordInfoData: {
                    laboratoryResultNo: '',
                    animalId: '',
                    sex: '',
                    farmId: '',
                    farmName: '',
                    dateResult: '',
                    dateSubmitted: '',
                    tests: {
                        esr: '',
                        prlr: '',
                        rbp4: '',
                        lif: '',
                        hfabp: '',
                        igf2: '',
                        lepr: '',
                        myog: '',
                        pss: '',
                        rn: '',
                        bax: '',
                        fut1: '',
                        mx1: '',
                        nramp: '',
                        bpi: ''
                    }
                }
            }
        },

        watch: {
            // Check if test is not chosen/shown anymore
            // then reset value of test to default
            'showChoices.esr': function(oldValue, newValue) {
                if(oldValue === false) this.recordInfoData.tests.esr = '';
            },
            'showChoices.prlr': function(oldValue, newValue) {
                if(oldValue === false) this.recordInfoData.tests.prlr = '';
            },
            'showChoices.rbp4': function(oldValue, newValue) {
                if(oldValue === false) this.recordInfoData.tests.rbp4 = '';
            },
            'showChoices.lif': function(oldValue, newValue) {
                if(oldValue === false) this.recordInfoData.tests.lif = '';
            },
            'showChoices.hfabp': function(oldValue, newValue) {
                if(oldValue === false) this.recordInfoData.tests.hfabp = '';
            },
            'showChoices.igf2': function(oldValue, newValue) {
                if(oldValue === false) this.recordInfoData.tests.igf2 = '';
            },
            'showChoices.lepr': function(oldValue, newValue) {
                if(oldValue === false) this.recordInfoData.tests.lepr = '';
            },
            'showChoices.myog': function(oldValue, newValue) {
                if(oldValue === false) this.recordInfoData.tests.myog = '';
            },
            'showChoices.pss': function(oldValue, newValue) {
                if(oldValue === false) this.recordInfoData.tests.pss = '';
            },
            'showChoices.rn': function(oldValue, newValue) {
                if(oldValue === false) this.recordInfoData.tests.rn = '';
            },
            'showChoices.bax': function(oldValue, newValue) {
                if(oldValue === false) this.recordInfoData.tests.bax = '';
            },
            'showChoices.fut1': function(oldValue, newValue) {
                if(oldValue === false) this.recordInfoData.tests.fut1 = '';
            },
            'showChoices.mx1': function(oldValue, newValue) {
                if(oldValue === false) this.recordInfoData.tests.mx1 = '';
            },
            'showChoices.nramp': function(oldValue, newValue) {
                if(oldValue === false) this.recordInfoData.tests.nramp = '';
            },
            'showChoices.bpi': function(oldValue, newValue) {
                if(oldValue === false) this.recordInfoData.tests.bpi = '';
            },
        },

        methods: {
            goToTab(tabId) {
                this.$nextTick(() => {
                    $('#add-lab-result-tabs ul.tabs').tabs('select_tab', tabId);
                    // Scroll animation
                    $('html, body').animate({
                        scrollTop: $(`#add-lab-result-tabs`).offset().top - 70 + "px"
                    }, 500);
                });
            },

            saveLaboratoryResults(event) {
                const vm = this;
                const saveLabResultsButton = $('.save-btn');

                this.disableButtons(saveLabResultsButton, event.target, 'Saving...');

                // Add to server's database
                axios.post('/genomics/manage/laboratory-results', vm.recordInfoData)
                .then((response) => {
                    // Reset registering of lab results to default values
                    vm.recordInfoData = {
                        laboratoryResultNo: '',
                        animalId: '',
                        sex: '',
                        farmId: '',
                        farmName: '',
                        dateResult: '',
                        dateSubmitted: '',
                        tests: {
                            esr: '',
                            prlr: '',
                            rbp4: '',
                            lif: '',
                            hfabp: '',
                            igf2: '',
                            lepr: '',
                            myog: '',
                            pss: '',
                            rn: '',
                            bax: '',
                            fut1: '',
                            mx1: '',
                            nramp: '',
                            bpi: ''
                        }
                    };

                    // Update UI after adding breed
                    vm.$nextTick(() => {
                        this.enableButtons(saveLabResultsButton, event.target, 'Save');

                        Materialize.toast('Laboratory Results saved.', 2500, 'green lighten-1');

                        // Reload page
                        setTimeout(() => {
                            window.location.reload();
                        }, 2600);
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            },

            disableButtons(buttons, actionBtnElement, textToShow) {
                buttons.addClass('disabled');
                actionBtnElement.innerHTML = textToShow;
            },

            enableButtons(buttons, actionBtnElement, textToShow) {
                buttons.removeClass('disabled');
                actionBtnElement.innerHTML = textToShow;
            }
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

    .card-traits-container {
        padding-bottom: 1rem;
    }

    div.card-action {
        border-top: 0;
        background-color: rgba(236, 239, 241, 0.7);
    }

    /* Accent highlights on cards */
    #fertility-container > .card {
        border-top: 4px solid #2672a6;
    }

    #meat-and-growth-container > .card {
        border-top: 4px solid #26a69a;
    }

    #defects-container > .card {
        border-top: 4px solid #9a26a6;
    }

    #diseases-container > .card {
        border-top: 4px solid #a69a26;
    }

</style>
