@extends('home')

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

        .bar { fill: steelblue; }

        /* swine pedigree filter */
        #swine-pedigree-filter {
            padding-bottom: 3rem;
        }

        #generate-button-container {
            margin-top: 1rem;
        }

        #pedigree-diagram-container {
            padding: 2rem 1rem 2rem 1rem;
        }

        /* Accent highlights on cards */
        #swine-pedigree-filter.card {
            border-top: 4px solid #2672a6;
        }

        #pedigree-diagram-container.card {
            border-top: 4px solid #2692a6;
        }

        /* Some container styles */
        #no-pedigree-text-container {
            padding: 5rem;
        }

        #error-pedigree-text-container {
            padding: 5rem;
            display: none;
        }

        #message-blockquote-container {
            display: none;
        }

        #pedigree-preloader-container {
            padding: 5rem;
            display: none;
        }
    </style>
@endsection

@section('content')

<div class="row">
    <div class="col s10 offset-s1">
        <div class="col s12">
            <h4 class="title-page"> Swine Pedigree </h4>
        </div>
        {{-- Swine Pedigree Filter container --}}
        <div id="swine-pedigree-filter" class="card col s6 m6 l4 offset-s3 offset-m3 offset-l4">
            <div class="card-content">
                <span class="card-title center-align">Filter</span>
                <div class="input-field col s12">
                    <input type="text" id="autocomplete-input" class="autocomplete validate">
                    <label for="autocomplete-input">Swine Registration Number</label>
                </div>
                <div class="col s12">
                    <h6> Number of Generations </h6>
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
                    <p>
                        <input name="generation" type="radio" id="value-six" value="6" />
                        <label for="value-six">6</label>
                    </p>
                </div>
                <div id="generate-button-container" class="col s12 center-align">
                    <a id="generate-button" class="waves-effect waves-light btn">Generate Pedigree</a>
                </div>
            </div>
        </div>

        <div id="pedigree-diagram-container" class="card col s12">
            {{-- No Swine chosen text container --}}
            <div id="no-pedigree-text-container" class="col s12">
                <p class="center-align">
                    <b>No chosen swine yet. Please enter Swine Registration Number.</b>
                </p>
            </div>

            {{-- Error on Finding Pedigree text container --}}
            <div id="error-pedigree-text-container" class="col s12">
                <p class="center-align">
                    <b>Error in finding Swine. Please make sure to enter correct Swine Registration Number.</b>
                </p>
            </div>

            {{-- Message from server text container --}}
            <div id="message-blockquote-container" class="col s12">
                <blockquote id="message-blockquote" class="info">

                </blockquote>
            </div>

            {{-- Preloader container --}}
            <div id="pedigree-preloader-container" class="col s12 center-align">
                <div class="preloader-wrapper big active">
                    <div class="spinner-layer spinner-blue-only">
                        <div class="circle-clipper left">
                            <div class="circle"></div>
                        </div>
                        <div class="gap-patch">
                            <div class="circle"></div>
                        </div>
                        <div class="circle-clipper right">
                            <div class="circle"></div>
                        </div>
                    </div>
                </div>
                <p>
                    Loading Pedigree...
                </p>
            </div>

            {{-- Container for SVG of Pedigree produced from pediview.js --}}
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
        const generatePedigreeButton = document.getElementById('generate-button');

        const disableButtons = (actionBtnElement, textToShow) => {
            actionBtnElement.classList.add('disabled');
            actionBtnElement.innerHTML = textToShow;
        };

        const enableButtons = (actionBtnElement, textToShow) => {
            actionBtnElement.classList.remove('disabled');
            actionBtnElement.innerHTML = textToShow;
        };

        // Bind click event listener to button
        generatePedigreeButton.addEventListener('click', function(event){
            const mainDivContainer = document.getElementById('mainDiv');
            const pedigreePreloaderContainer = document.getElementById('pedigree-preloader-container');
            const noPedigreeTextContainer = document.getElementById('no-pedigree-text-container');
            const errorPedigreeTextContainer = document.getElementById('error-pedigree-text-container');
            const messageBlockquoteContainer = document.getElementById('message-blockquote-container');
            const messageBlockquote = document.getElementById('message-blockquote');
            const autocompleteInput = document.querySelector('#autocomplete-input');
            const generation = document.querySelector('input[name="generation"]:checked').value;
            const regNo = autocompleteInput.value;
            const generateButtonEl = event.target;

            disableButtons(generateButtonEl, 'Generating...');

            // Hide text displaying there is no chosen swine and display preloader.
            // Also, show main div container if hidden, hide error
            // pedigree text container if displayed, and hide
            // message blockquote container if displayed
            noPedigreeTextContainer.style.display = 'none';
            pedigreePreloaderContainer.style.display = 'block';
            mainDivContainer.style.display = 'block';

            if(mainDivContainer.style.display === 'none'){
                mainDivContainer.style.display = 'block';
            }
            if(errorPedigreeTextContainer.style.display === 'block'){
                errorPedigreeTextContainer.style.display = 'none';
            }
            if(messageBlockquoteContainer.style.display === 'block'){
                messageBlockquoteContainer.style.display = 'none';
            }

            if(regNo){
                // Do a GET request to server to get swine's pedigree
                axios.get(`/pedigree/reg/${regNo}/gen/${generation}`)
                    .then(function(response){
                        // Hide preloader
                        pedigreePreloaderContainer.style.display = 'none';

                        // Remove 'invalid' class add 'valid' class
                        // to autocomplete input
                        autocompleteInput.classList.remove('invalid');
                        autocompleteInput.classList.add('valid');

                        // Call visualize function from pediview.js
                        visualize(response.data.pedigree);

                        // Display message from server if it exists
                        if(response.data.message.length > 0){
                            messageBlockquoteContainer.style.display = 'block';
                            messageBlockquote.innerHTML = response.data.message;
                        }

                        enableButtons(generateButtonEl, 'Generate Pedigree');
                    })
                    .catch(function(error){
                        // Hide preloader and SVG pedigree container then display
                        // error pedigree text container
                        mainDivContainer.style.display = 'none';
                        pedigreePreloaderContainer.style.display = 'none';
                        errorPedigreeTextContainer.style.display = 'block';

                        // Remove 'valid' and add 'invalid' class
                        // to autocomplete input
                        autocompleteInput.classList.remove('valid');
                        autocompleteInput.classList.add('invalid');

                        enableButtons(generateButtonEl, 'Generate Pedigree');

                        console.log(error);
                    });
            }
        });
    </script>
@endsection
