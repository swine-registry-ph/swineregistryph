@extends('users.breeder.home')

@section('title')
    | Swine Pedigree
@endsection

@section('customStyle')
    <style media="screen">
        .node circle {
            fill: white;
            stroke-width:	2px;
        }

        .node text {
            font:	12px sans-serif;
            background: white;
        }

        .node--internal text {

            text-shadow: 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff;
            background: white;
        }

        .link {
            fill: none;
            stroke:	black;
            stroke-width: 0.5px;
        }

        div.tooltip {
            position: absolute !important;
            text-align: center !important;
            padding: 2px !important;
            font: 12px sans-serif !important;
            background: #E5FCC2 !important;
            border: 0px !important;
            border-radius: 8px !important;
            pointer-events: none !important;
            text-align: justify !important;
        }

        svg {
            border: 1px solid #c6b89e;
            border-radius: 5px;
            margin-top: 5px;
        }

        span.msg,
        span.choose {
          color: #555;
          padding: 5px 0 10px;
          display: inherit
        }

        /*Styling Selectbox*/
        .dropdown {
          width: 50%;
          display: inline-block;
          background-color: #fff;
          border-radius: 5px;
          box-shadow: 0 0 2px rgb(204, 204, 204);
          /*transition: all .5s ease;*/
          position: relative;
          font-size: 14px;
          color: #474747;
          height: 100%;
          text-align: left
        }
        .dropdown .select {
            cursor: pointer;
            display: block;
            padding: 10px
        }
        .dropdown .select > i {
            font-size: 13px;
            color: #888;
            cursor: pointer;
            transition: all .3s ease-in-out;
            float: right;
            line-height: 20px
        }
        .dropdown:hover {
            box-shadow: 0 0 4px rgb(204, 204, 204)
        }
        .dropdown:active {
            background-color: #f8f8f8
        }
        .dropdown.active:hover,
        .dropdown.active {
            box-shadow: 0 0 4px rgb(204, 204, 204);
            border-radius: 5px 5px 0 0;
            background-color: #f8f8f8
        }
        .dropdown.active .select > i {
            transform: rotate(-90deg)
        }
        .dropdown .dropdown-menu {
            position: absolute;
            background-color: #fff;
            width: 100%;
            left: 0;
            margin-top: 1px;
            box-shadow: 0 1px 2px rgb(204, 204, 204);
            border-radius: 0 1px 5px 5px;
            overflow: hidden;
            display: none;
            max-height: 144px;
            overflow-y: auto;
            z-index: 9
        }
        .dropdown .dropdown-menu li {
            padding: 10px;
            transition: all .2s ease-in-out;
            cursor: pointer
        }
        .dropdown .dropdown-menu {
            padding: 0;
            list-style: none
        }
        .dropdown .dropdown-menu li:hover {
            background-color: #f2f2f2
        }
        .dropdown .dropdown-menu li:active {
            background-color: #e2e2e2
        }

        /* swine pedigree filter */
        #swine-pedigree-filter {
            padding-bottom: 3rem;
        }

        #generate-button-container {
            margin-top: 1rem;
        }
    </style>
@endsection

@section('content')

<div class="row">
    <div class="col s10 offset-s1">
        <div class="col s12">
            <h4 class="title-page"> Swine Pedigree </h4>
        </div>
        <div id="swine-pedigree-filter" class="card col s6 m6 l4 offset-s3 offset-m3 offset-l4">
            <div class="card-content">
                <span class="card-title center-align">Filter</span>
                <div class="input-field col s12">
                    <input type="text" id="autocomplete-input" class="autocomplete">
                    <label for="autocomplete-input">Swine Registration Number</label>
                </div>
                <div class="col s12">
                    <h6>
                        Number of Generations
                    </h6>
                    <p>
                        <input name="generation" type="radio" id="value-one" value="1" checked/>
                        <label for="value-one">1</label>
                    </p>
                    <p>
                        <input name="generation" type="radio" id="value-two" value="2" />
                        <label for="value-two">2</label>
                    </p>
                    <p>
                        <input name="generation" type="radio" id="value-three" value="3" />
                        <label for="value-three">3</label>
                    </p>
                    <p>
                        <input name="generation" type="radio" id="value-four" value="4" />
                        <label for="value-four">4</label>
                    </p>
                    <p>
                        <input name="generation" type="radio" id="value-five" value="5" />
                        <label for="value-five">5</label>
                    </p>
                </div>
                <div id="generate-button-container" class="col s12 center-align">
                    <a id="generate-button" class="waves-effect waves-light btn">Generate Pedigree</a>
                </div>
            </div>
        </div>

        <div id="pedigree-diagram-container" class="card col s12">
            <div id="mainDiv"></div>
        </div>

        <div class="col s12">
            <p> <br> </p>
        </div>
    </div>
</div>

@endsection

@section('customScript')
    <script src="/js/d3.min.js" charset="utf-8"></script>
    <script src="/js/pediview.js" charset="utf-8"></script>
    <script type="text/javascript">
        $(document).ready(function(){
            // Initialize autocomplete data
            $('input.autocomplete').autocomplete({
                data: {!! json_encode($autocompleteData) !!},
                limit: 7, // The max amount of results that can be shown at once. Default: Infinity.
                minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
            });
        });

        const generatePedigreeButton = document.getElementById('generate-button');

        // Bind click event listener to button
        generatePedigreeButton.addEventListener('click', function(){
            const regNo = document.querySelector('#autocomplete-input').value;
            const generation = document.querySelector('input[name="generation"]:checked').value;

            if(regNo){
                // Do a GET request to server to get swine's pedigree
                axios.get(`/breeder/pedigree/reg/${regNo}/gen/${generation}`)
                    .then(function(response){
                        // Call visualize function from pediview.js
                        visualize(response.data);
                    })
                    .catch(function(error){
                        console.log(error);
                    });
            }
        });

        let json = {
            "registrationnumber":"MASKERPT2017FO-2793",
            "qualitative_info": {
                "farm_name":"Mapusagafou",
                "breed":"Duroc",
                "sex":"Male",
                "birthyear":"1994",
                "date_registered": "2014-02-10",
                "registered_by":"Wendy"
            },
            "quantitative_info": {
                "weight_at_data_collection": 57,
                "age_at_data_collection": 4,
                "average_daily_gain":7,
                "backfat_thickness": 3,
                "feed_efficiency": 3,
                "birth_weight":8,
                "total_when_born_male": 7,
                "total_when_born_female": 6,
                "littersize_born_alive": 5,
                "parity": 1
            },
            "parents": [
                {
                    "registrationnumber":"MASKERPT2017MO-2795",
                    "qualitative_info": {
                        "farm_name":"Mapusagafou",
                        "breed":"Yorkshire",
                        "sex":"Male",
                        "birthyear":"2005",
                        "date_registered": "2008-07-20",
                        "registered_by":"Netty"
                    },
                    "quantitative_info": {
                        "weight_at_data_collection": 59,
                        "age_at_data_collection": 6,
                        "average_daily_gain":9,
                        "backfat_thickness": 5,
                        "feed_efficiency": 5,
                        "birth_weight":10,
                        "total_when_born_male": 9,
                        "total_when_born_female": 8,
                        "littersize_born_alive": 7,
                        "parity": 3
                    },
                    "parents":[
                        {
                            "registrationnumber":"MASKERPT2017MO-2793",
                            "qualitative_info": {
                                "farm_name":"Mapusagafou",
                                "breed":"Yorkshire",
                                "sex":"Male",
                                "birthyear":"2005",
                                "date_registered": "2008-07-20",
                                "registered_by":"Netty"
                            },
                            "quantitative_info": {
                                "weight_at_data_collection": 59,
                                "age_at_data_collection": 6,
                                "average_daily_gain":9,
                                "backfat_thickness": 5,
                                "feed_efficiency": 5,
                                "birth_weight":10,
                                "total_when_born_male": 9,
                                "total_when_born_female": 8,
                                "littersize_born_alive": 7,
                                "parity": 3
                            }
                        },
                        {
                            "registrationnumber":"MASKERPT2017FO-2791",
                            "qualitative_info": {
                                "farm_name":"Mapusagafou",
                                "breed":"Yorkshire",
                                "sex":"Female",
                                "birthyear":"2005",
                                "date_registered": "2008-07-20",
                                "registered_by":"Netty"
                            },
                            "quantitative_info": {
                                "weight_at_data_collection": 59,
                                "age_at_data_collection": 6,
                                "average_daily_gain":9,
                                "backfat_thickness": 5,
                                "feed_efficiency": 5,
                                "birth_weight":10,
                                "total_when_born_male": 9,
                                "total_when_born_female": 8,
                                "littersize_born_alive": 7,
                                "parity": 3
                            }
                        }
                    ]
                },
                {
                    "registrationnumber":"MASKERPT2017FO-2796",
                    "qualitative_info": {
                        "farm_name":"Mapusagafou",
                        "breed":"Yorkshire",
                        "sex":"Female",
                        "birthyear":"2005",
                        "date_registered": "2008-07-20",
                        "registered_by":"Netty"
                    },
                    "quantitative_info": {
                        "weight_at_data_collection": 59,
                        "age_at_data_collection": 6,
                        "average_daily_gain":9,
                        "backfat_thickness": 5,
                        "feed_efficiency": 5,
                        "birth_weight":10,
                        "total_when_born_male": 9,
                        "total_when_born_female": 8,
                        "littersize_born_alive": 7,
                        "parity": 3
                    },
                    "parents":[
                        {
                            "registrationnumber":"MASKERPT2017MO-2797",
                            "qualitative_info": {
                                "farm_name":"Mapusagafou",
                                "breed":"Yorkshire",
                                "sex":"Male",
                                "birthyear":"2005",
                                "date_registered": "2008-07-20",
                                "registered_by":"Netty"
                            },
                            "quantitative_info": {
                                "weight_at_data_collection": 59,
                                "age_at_data_collection": 6,
                                "average_daily_gain":9,
                                "backfat_thickness": 5,
                                "feed_efficiency": 5,
                                "birth_weight":10,
                                "total_when_born_male": 9,
                                "total_when_born_female": 8,
                                "littersize_born_alive": 7,
                                "parity": 3
                            }
                        },
                        {
                            "registrationnumber":"MASKERPT2017FO-2798",
                            "qualitative_info": {
                                "farm_name":"Mapusagafou",
                                "breed":"Yorkshire",
                                "sex":"Female",
                                "birthyear":"2005",
                                "date_registered": "2008-07-20",
                                "registered_by":"Netty"
                            },
                            "quantitative_info": {
                                "weight_at_data_collection": 59,
                                "age_at_data_collection": 6,
                                "average_daily_gain":9,
                                "backfat_thickness": 5,
                                "feed_efficiency": 5,
                                "birth_weight":10,
                                "total_when_born_male": 9,
                                "total_when_born_female": 8,
                                "littersize_born_alive": 7,
                                "parity": 3
                            }
                        }
                    ]
                }
            ]
        };

        visualize(json);
    </script>
@endsection
