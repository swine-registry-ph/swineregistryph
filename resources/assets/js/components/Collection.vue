<template>
    <div class="col s10 offset-s1">
        <div class="row" style="margin-bottom:0;">
            <div class="col s12" style="margin-top:2rem; padding:0;">
                <ul class="tabs tabs-fixed-width z-depth-2">
                    <li class="tab col s3"><a href="#basic-information">Basic Information</a></li>
                    <li class="tab col s2"><a href="#gp-1">GP1</a></li>
                    <li class="tab col s2"><a href="#gp-sire">GP Sire</a></li>
                    <li class="tab col s2"><a href="#gp-dam">GP Dam</a></li>
                    <li class="tab col s2"><a href="#summary">Summary</a></li>
                    <li class="tab col s2"><a href="#swinecart">SwineCart</a></li>
                </ul>
            </div>
        </div>

        <div id="basic-information" class="row">
            <div class="card col s12" style="margin-top:.2rem;">
                <div class="card-content">
                    <span class="card-title">Basic Information</span>
                    <p class="row">
                        <div class="input-field col s4">
                            <input id="breed" type="text" class="validate">
                            <label for="breed">Breed</label>
                        </div>
                        <div class="input-field col s2">
                            <input id="sex" type="text" class="validate">
                            <label for="sex">Sex</label>
                        </div>
                        <div class="input-field col s6">
                            <input id="birth-year" type="date" class="validate datepicker">
                            <label for="birth-year">Birth Year</label>
                        </div>
                        <div class="input-field col s4">
                            <input id="age" type="text" class="validate">
                            <label for="age">Age when data was collected</label>
                        </div>
                        <div class="input-field col s4">
                            <input id="weight" type="text" class="validate">
                            <label for="weight">Weight when data was collected</label>
                        </div>
                    </p>
                </div>
            </div>
        </div>

        <!-- GP 1, GP Sire, and GP Dam tab containers -->
        <swine-properties :category="'gp-1'" :data="{}"></swine-properties>
        <swine-properties :category="'gp-sire'" :data="{}"></swine-properties>
        <swine-properties :category="'gp-dam'" :data="{}"></swine-properties>

        <div id="summary" class="row">
            <div class="card col s12">
                <div class="card-content">
                    <span class="card-title">Summary</span>
                    <p></p>
                </div>
            </div>
        </div>

        <div id="swinecart" class="row">
            <div class="card col s12">
                <div class="card-content">
                    <span class="card-title">Link for SwineCart (E-commerce)</span>
                    <p></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        mounted() {
            // Initialize datepicker
            $('.datepicker').pickadate({
                selectMonths: true,
                selectYears: 4
            });

            console.log('Component mounted.');
        }
    }
</script>
