@extends('layouts.app')

@section('title')
    | Register Swine
@endsection

@section('content')

<div class="container">
    <div class="row">
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

            <div id="gp-1" class="row">
                <div class="card col s12">
                    <div class="card-content">
                        <span class="card-title">GP1</span>
                        <p>
                            <div class="input-field">
                                <input id="adg" type="text" class="validate">
                                <label for="adg">Average Daily Gain (g/day)</label>
                            </div>
                            <div class="input-field">
                                <input id="bft" type="text" class="validate">
                                <label for="bft">Backfat Thickness (mm)</label>
                            </div>
                            <div class="input-field">
                                <input id="feed-efficiency" type="text" class="validate">
                                <label for="feed-efficiency">Feed Efficiency (gain/feed)</label>
                            </div>
                            <div class="input-field">
                                <input id="birth-weight" type="text" class="validate">
                                <label for="birth-weight">Birth weight</label>
                            </div>
                            <div class="input-field">
                                <input id="total-m" type="text" class="validate">
                                <label for="total-m">Total (M) when born</label>
                            </div>
                            <div class="input-field">
                                <input id="total-f" type="text" class="validate">
                                <label for="total-f">Total (F) when born</label>
                            </div>
                            <div class="input-field">
                                <input id="littersize-alive" type="text" class="validate">
                                <label for="littersize-alive">Littersize born alive</label>
                            </div>
                            <div class="input-field">
                                <input id="parity" type="text" class="validate">
                                <label for="parity">Parity</label>
                            </div>
                            <div class="input-field">
                                <input id="littersize-weaning" type="text" class="validate">
                                <label for="littersize-weaning">Littersize at weaning</label>
                            </div>
                            <div class="input-field">
                                <input id="litterweight-weaning" type="text" class="validate">
                                <label for="litterweight-weaning">Litter weight at weaning</label>
                            </div>
                        </p>
                    </div>
                </div>
            </div>

            <div id="gp-sire" class="row">
                <div class="card col s12">
                    <div class="card-content">
                        <span class="card-title">GP Sire</span>
                        <p>
                            <div class="input-field">
                                <input id="adg" type="text" class="validate">
                                <label for="adg">Average Daily Gain (g/day)</label>
                            </div>
                            <div class="input-field">
                                <input id="bft" type="text" class="validate">
                                <label for="bft">Backfat Thickness (mm)</label>
                            </div>
                            <div class="input-field">
                                <input id="feed-efficiency" type="text" class="validate">
                                <label for="feed-efficiency">Feed Efficiency (gain/feed)</label>
                            </div>
                            <div class="input-field">
                                <input id="birth-weight" type="text" class="validate">
                                <label for="birth-weight">Birth weight</label>
                            </div>
                            <div class="input-field">
                                <input id="total-m" type="text" class="validate">
                                <label for="total-m">Total (M) when born</label>
                            </div>
                            <div class="input-field">
                                <input id="total-f" type="text" class="validate">
                                <label for="total-f">Total (F) when born</label>
                            </div>
                            <div class="input-field">
                                <input id="littersize-alive" type="text" class="validate">
                                <label for="littersize-alive">Littersize born alive</label>
                            </div>
                            <div class="input-field">
                                <input id="parity" type="text" class="validate">
                                <label for="parity">Parity</label>
                            </div>
                            <div class="input-field">
                                <input id="littersize-weaning" type="text" class="validate">
                                <label for="littersize-weaning">Littersize at weaning</label>
                            </div>
                            <div class="input-field">
                                <input id="litterweight-weaning" type="text" class="validate">
                                <label for="litterweight-weaning">Litter weight at weaning</label>
                            </div>
                        </p>
                    </div>
                </div>
            </div>


            <div id="gp-dam" class="row">
                <div class="card col s12">
                    <div class="card-content">
                        <span class="card-title">GP Dam</span>
                        <p>
                            <div class="input-field">
                                <input id="adg" type="text" class="validate">
                                <label for="adg">Average Daily Gain (g/day)</label>
                            </div>
                            <div class="input-field">
                                <input id="bft" type="text" class="validate">
                                <label for="bft">Backfat Thickness (mm)</label>
                            </div>
                            <div class="input-field">
                                <input id="feed-efficiency" type="text" class="validate">
                                <label for="feed-efficiency">Feed Efficiency (gain/feed)</label>
                            </div>
                            <div class="input-field">
                                <input id="birth-weight" type="text" class="validate">
                                <label for="birth-weight">Birth weight</label>
                            </div>
                            <div class="input-field">
                                <input id="total-m" type="text" class="validate">
                                <label for="total-m">Total (M) when born</label>
                            </div>
                            <div class="input-field">
                                <input id="total-f" type="text" class="validate">
                                <label for="total-f">Total (F) when born</label>
                            </div>
                            <div class="input-field">
                                <input id="littersize-alive" type="text" class="validate">
                                <label for="littersize-alive">Littersize born alive</label>
                            </div>
                            <div class="input-field">
                                <input id="parity" type="text" class="validate">
                                <label for="parity">Parity</label>
                            </div>
                            <div class="input-field">
                                <input id="littersize-weaning" type="text" class="validate">
                                <label for="littersize-weaning">Littersize at weaning</label>
                            </div>
                            <div class="input-field">
                                <input id="litterweight-weaning" type="text" class="validate">
                                <label for="litterweight-weaning">Litter weight at weaning</label>
                            </div>
                        </p>
                    </div>
                </div>
            </div>

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
    </div>
</div>

@endsection


@section('customScript')
    <script type="text/javascript">
        $(document).ready(function(){
            $('.datepicker').pickadate({
                selectMonths: true,
                selectYears: 4
            });
        });
    </script>
@endsection
