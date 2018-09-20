<template>
    <div class="col s12">

        <div class="col s12">
            <h4 class="title-page"> Edit Laboratory Results </h4>
        </div>

        <div class="col s12">
            <a @click.prevent="hideEditLabResultsView"
                id="back-to-viewing-btn"
                href="#!"
                class="btn custom-secondary-btn blue-text text-darken-1 z-depth-0"
            >
                <i class="material-icons left">keyboard_arrow_left</i>
                Back To Viewing
            </a>
        </div>

        <!-- Tab -->
        <div class="row" style="margin-bottom:0;">
            <div id="edit-lab-result-tabs" class="col s12" style="margin-top:2rem; padding:0;">
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
                                <input v-model="labResultData.laboratoryResultNo"
                                    id="lab-result-no"
                                    type="text"
                                    class="validate"
                                >
                                <label for="lab-result-no">Laboratory Result No.</label>
                            </div>

                            <!-- Animal ID -->
                            <div class="col s12 input-field">
                                <input v-model="labResultData.animalId"
                                    id="animal-id"
                                    type="text"
                                    class="validate"
                                >
                                <label for="animal-id">Animal ID</label>
                            </div>

                            <!-- Sex -->
                            <div class="col s12 input-field">
                                <component :is="'app-input-select'"
                                    labelDescription="Sex"
                                    v-model="labResultData.sex"
                                    :options="[{text:'Male', value:'male'}, {text:'Female', value:'female'}]"
                                    @select="val => {labResultData.sex = val}"
                                >
                                </component>
                            </div>

                            <!-- Date of Result -->
                            <div class="col s12 input-field">
                                <app-input-date
                                    v-model="labResultData.dateResult"
                                    @date-select="val => {labResultData.dateResult = val}"
                                >
                                </app-input-date>
                                <label for="">Date of Result</label>
                            </div>

                            <!-- Date Submitted -->
                            <div class="col s12 input-field">
                                <app-input-date
                                    v-model="labResultData.dateSubmitted"
                                    @date-select="val => {labResultData.dateSubmitted = val}"
                                >
                                </app-input-date>
                                <label for="">Date Submitted</label>
                            </div>

                            <div class="col s12">
                                <br>
                            </div>

                            <div class="col s12">
                                <h6>
                                    <b>Is Farm registered in the system?</b>
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
                                <component :is="'app-input-select'"
                                    labelDescription="Farm Of Origin"
                                    v-model="labResultData.farmId"
                                    :options="farmoptions"
                                    @select="val => {labResultData.farmId = val}"
                                >
                                </component>
                            </div>

                            <!-- Not yet registered Farm -->
                            <div v-show="showChoices.farm === 'not-registered'" class="col s12 input-field">
                                <input v-model="labResultData.farmName"
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
                                                    <span v-for="(choice, index) in testChoices.esr" :key="choice">
                                                        <input v-model="labResultData.tests.esr" 
                                                            name="esr" 
                                                            type="radio" 
                                                            :id="`esr-${index}`"
                                                            :value="choice" 
                                                        />
                                                        <label :for="`esr-${index}`"> {{choice}} </label>
                                                    </span>
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
                                                    <span v-for="(choice, index) in testChoices.prlr" :key="choice">
                                                        <input v-model="labResultData.tests.prlr" 
                                                            name="prlr" 
                                                            type="radio" 
                                                            :id="`prlr${index}`"
                                                            :value="choice" 
                                                        />
                                                        <label :for="`prlr${index}`"> {{choice}} </label>
                                                    </span>
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
                                                    <span v-for="(choice, index) in testChoices.rbp4" :key="choice">
                                                        <input v-model="labResultData.tests.rbp4" 
                                                            name="rbp4" 
                                                            type="radio" 
                                                            :id="`rbp4-${index}`"
                                                            :value="choice" 
                                                        />
                                                        <label :for="`rbp4-${index}`"> {{choice}} </label>
                                                    </span>
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
                                                    <span v-for="(choice, index) in testChoices.lif" :key="choice">
                                                        <input v-model="labResultData.tests.lif" 
                                                            name="lif" 
                                                            type="radio" 
                                                            :id="`lif-${index}`"
                                                            :value="choice" 
                                                        />
                                                        <label :for="`lif-${index}`"> {{choice}} </label>
                                                    </span>
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
                                                    <span v-for="(choice, index) in testChoices.hfabp" :key="choice">
                                                        <input v-model="labResultData.tests.hfabp" 
                                                            name="hfabp" 
                                                            type="radio" 
                                                            :id="`hfabp-${index}`"
                                                            :value="choice" 
                                                        />
                                                        <label :for="`hfabp-${index}`"> {{choice}} </label>
                                                    </span>
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
                                                    <span v-for="(choice, index) in testChoices.igf2" :key="choice">
                                                        <input v-model="labResultData.tests.igf2" 
                                                            name="igf2" 
                                                            type="radio" 
                                                            :id="`igf2-${index}`"
                                                            :value="choice" 
                                                        />
                                                        <label :for="`igf2-${index}`"> {{choice}} </label>
                                                    </span>
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
                                                    <span v-for="(choice, index) in testChoices.lepr" :key="choice">
                                                        <input v-model="labResultData.tests.lepr" 
                                                            name="lepr" 
                                                            type="radio" 
                                                            :id="`lepr-${index}`"
                                                            :value="choice" 
                                                        />
                                                        <label :for="`lepr-${index}`"> {{choice}} </label>
                                                    </span>
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
                                                    <span v-for="(choice, index) in testChoices.myog" :key="choice">
                                                        <input v-model="labResultData.tests.myog" 
                                                            name="myog" 
                                                            type="radio" 
                                                            :id="`myog-${index}`"
                                                            :value="choice" 
                                                        />
                                                        <label :for="`myog-${index}`"> {{choice}} </label>
                                                    </span>
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
                                                    <span v-for="(choice, index) in testChoices.pss" :key="choice">
                                                        <input v-model="labResultData.tests.pss" 
                                                            name="pss" 
                                                            type="radio" 
                                                            :id="`pss-${index}`"
                                                            :value="choice.toUpperCase()" 
                                                        />
                                                        <label :for="`pss-${index}`"> {{choice}} </label>
                                                    </span>
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
                                                    <span v-for="(choice, index) in testChoices.rn" :key="choice">
                                                        <input v-model="labResultData.tests.rn" 
                                                            name="rn" 
                                                            type="radio" 
                                                            :id="`rn-${index}`"
                                                            :value="choice.toUpperCase()" 
                                                        />
                                                        <label :for="`rn-${index}`"> {{choice}} </label>
                                                    </span>
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
                                                    <span v-for="(choice, index) in testChoices.bax" :key="choice">
                                                        <input v-model="labResultData.tests.bax" 
                                                            name="bax" 
                                                            type="radio" 
                                                            :id="`bax-${index}`"
                                                            :value="choice.toUpperCase()" 
                                                        />
                                                        <label :for="`bax-${index}`"> {{choice}} </label>
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Diseases Resistance Card -->
                        <div id="diseases-container" class="col s6">
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
                                                    <span v-for="(choice, index) in testChoices.fut1" :key="choice">
                                                        <input v-model="labResultData.tests.fut1" 
                                                            name="fut1" 
                                                            type="radio" 
                                                            :id="`fut1-${index}`"
                                                            :value="choice" 
                                                        />
                                                        <label :for="`fut1-${index}`"> {{choice}} </label>
                                                    </span>
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
                                                    <span v-for="(choice, index) in testChoices.mx1" :key="choice">
                                                        <input v-model="labResultData.tests.mx1" 
                                                            name="mx1" 
                                                            type="radio" 
                                                            :id="`mx1-${index}`"
                                                            :value="choice.toUpperCase()" 
                                                        />
                                                        <label :for="`mx1-${index}`"> {{choice}} </label>
                                                    </span>
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
                                                    <span v-for="(choice, index) in testChoices.nramp" :key="choice">
                                                        <input v-model="labResultData.tests.nramp" 
                                                            name="nramp" 
                                                            type="radio" 
                                                            :id="`nramp-${index}`"
                                                            :value="choice" 
                                                        />
                                                        <label :for="`nramp-${index}`"> {{choice}} </label>
                                                    </span>
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
                                                    <span v-for="(choice, index) in testChoices.bpi" :key="choice">
                                                        <input v-model="labResultData.tests.bpi" 
                                                            name="bpi" 
                                                            type="radio" 
                                                            :id="`bpi-${index}`"
                                                            :value="choice" 
                                                        />
                                                        <label :for="`bpi-${index}`"> {{choice}} </label>
                                                    </span>
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
                    <!-- Update Button -->
                    <button @click.prevent="updateLabResults($event)"
                        class="btn save-btn blue darken-1 update-lab-results-btn"
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            editLabResultData: Object,
            farmoptions: Array
        },

        data() {
            return {
                labResultData: {
                    laboratoryResultId: 0,
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
                },
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
            }
        },

        watch: {
            editLabResultData(newValue, oldValue) {
                this.labResultData = newValue;

                // Check if farm is existing or not
                if(newValue.farmId) this.showChoices.farm = 'registered';
                else this.showChoices.farm = 'not-registered';

                // Iterate through existing tests 
                _.forIn(newValue.tests, (value, key) => {
                    this.showChoices[key] = (value) ? true : false;
                });

                // Update UI after data changes
                this.$nextTick(() => {
                    Materialize.updateTextFields();

                    $('ul.tabs').tabs();
                    $('ul.tabs').tabs('select_tab', 'general-information');
                });
            },
            // If farmId exists, find its corresponding farm name
            'labResultData.farmId': function(newValue, oldValue) {
                const farmName = this.findFarmNameById(newValue);
                
                if(farmName !== -1) this.labResultData.farmName = farmName;
            },
            // Check if test is not chosen/shown anymore
            // then reset value of test to default
            'showChoices.esr': function(newValue, oldValue) {
                if(newValue === false) this.labResultData.tests.esr = '';
            },
            'showChoices.prlr': function(newValue, oldValue) {
                if(newValue === false) this.labResultData.tests.prlr = '';
            },
            'showChoices.rbp4': function(newValue, oldValue) {
                if(newValue === false) this.labResultData.tests.rbp4 = '';
            },
            'showChoices.lif': function(newValue, oldValue) {
                if(newValue === false) this.labResultData.tests.lif = '';
            },
            'showChoices.hfabp': function(newValue, oldValue) {
                if(newValue === false) this.labResultData.tests.hfabp = '';
            },
            'showChoices.igf2': function(newValue, oldValue) {
                if(newValue === false) this.labResultData.tests.igf2 = '';
            },
            'showChoices.lepr': function(newValue, oldValue) {
                if(newValue === false) this.labResultData.tests.lepr = '';
            },
            'showChoices.myog': function(newValue, oldValue) {
                if(newValue === false) this.labResultData.tests.myog = '';
            },
            'showChoices.pss': function(newValue, oldValue) {
                if(newValue === false) this.labResultData.tests.pss = '';
            },
            'showChoices.rn': function(newValue, oldValue) {
                if(newValue === false) this.labResultData.tests.rn = '';
            },
            'showChoices.bax': function(newValue, oldValue) {
                if(newValue === false) this.labResultData.tests.bax = '';
            },
            'showChoices.fut1': function(newValue, oldValue) {
                if(newValue === false) this.labResultData.tests.fut1 = '';
            },
            'showChoices.mx1': function(newValue, oldValue) {
                if(newValue === false) this.labResultData.tests.mx1 = '';
            },
            'showChoices.nramp': function(newValue, oldValue) {
                if(newValue === false) this.labResultData.tests.nramp = '';
            },
            'showChoices.bpi': function(newValue, oldValue) {
                if(newValue === false) this.labResultData.tests.bpi = '';
            },
        },

        methods: {
            findFarmNameById(id) {
                for (let i = 0; i < this.farmoptions.length; i++) {
                    if(this.farmoptions[i].value === parseInt(id)) {
                        return this.farmoptions[i].text;
                    }
                }

                return -1;
            },

            goToTab(tabId) {
                this.$nextTick(() => {
                    $('#edit-lab-result-tabs ul.tabs').tabs('select_tab', tabId);
                    // Scroll animation
                    $('html, body').animate({
                        scrollTop: $(`#edit-lab-result-tabs`).offset().top - 70 + "px"
                    }, 500);
                });
            },

            hideEditLabResultsView() {
                this.$emit('hideEditLabResultsViewEvent');
            },

            updateLabResults(event) {
                const vm = this;
                const labResult = this.labResultData;
                const updateLabResultsBtn = $('.update-lab-results-btn');

                this.disableButtons(updateLabResultsBtn, event.target, 'Updating...');

                // Update to server's database
                axios.patch('/genomics/manage/laboratory-results', labResult)
                .then((response) => {
                    // Update parent component for changes
                    if(response.data.updated){
                        this.$emit('updateLabResultEvent', 
                            { labResult }
                        );
                    }

                    // Update UI after updating lab result
                    vm.$nextTick(() => {
                        $('#lab-result-no').removeClass('valid');
                        $('#animal-id').removeClass('valid');
                        $('#farm-name').removeClass('valid');

                        this.enableButtons(updateLabResultsBtn, event.target, 'Update');

                        Materialize.updateTextFields();
                        Materialize.toast(
                            `Laboratory Result No. ${labResult.laboratoryResultNo} updated`, 
                            1800, 
                            'green lighten-1'
                        );

                        // Call hiding of this view
                        setTimeout(() => {
                            vm.hideEditLabResultsView();
                        }, 2000);

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
        }
    }
</script>

<style scoped>
    .custom-secondary-btn {
        border: 1px solid;
        background-color: white !important;
    }

    #back-to-viewing-btn {
        margin-top: 2rem;
        margin-bottom: 1rem;
    }

    p.padded {
        padding-top: 1rem;
    }

    p.padded label {
        padding-right: 2rem;
    }

    /* Card Customizations */
    .card {
        padding: 0;
    }

    .card-traits-container {
        padding-bottom: 2rem;
    }

    div.card-action {
        border-top: 0;
        background-color: rgba(236, 239, 241, 0.7);
    }

    /* Accent highlights on cards */
    #fertility-container > .card {
        border-top: 4px solid #9a26a6;
    }

    #meat-and-growth-container > .card {
        border-top: 4px solid #9a26a6;
    }

    #defects-container > .card {
        border-top: 4px solid #9a26a6;
    }

    #diseases-container > .card {
        border-top: 4px solid #9a26a6;
    }
    
</style>
