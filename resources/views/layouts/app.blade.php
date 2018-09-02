<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }} @yield('title') </title>

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    @yield('customStyle')
</head>
<body>

    <header>
        <div id="custom-nav" class="navbar-fixed">
            <nav class="teal lighten-1">
                <div class="nav-wrapper">
                    @auth
                        <a href="#!" data-activates="slide-out" class="button-collapse show-on-large"><i class="material-icons">menu</i></a>
                    @endauth
                    <a href="{{ route('home') }}" class="brand-logo">{{ config('app.name', 'Laravel') }}</a>
                    <ul id="nav-mobile" class="right hide-on-med-and-down">
                        @if (Auth::guest())
                            <li><a href="{{ route('login') }}">Login</a></li>
                            {{-- <li><a href="{{ route('register') }}">Register</a></li> --}}
                        @else
                            <li><a href="{{ route('home') }}">{{ Auth::user()->name }}</a></li>
                            <li>
                                <a href="#!" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                                    Logout
                                </a>
                                <form id="logout-form" method="POST" action="{{ route('logout') }}">
                                    {{ csrf_field() }}
                                </form>
                            </li>
                        @endif
                    </ul>
                    @yield('sidebar')
                </div>
            </nav>
        </div>
    </header>

    {{-- Main content for authenticated users --}}
    @auth
        <main id="app" class="main-logged-in blue-grey lighten-5">
            @yield('content')
        </main>
    @endauth

    {{-- Main content for guest users --}}
    @guest
        <main id="app">
            @yield('content')
        </main>
    @endguest

    {{-- Footer for authenticated users --}}
    @auth
        <footer class="page-footer footer-logged-in">
            <div class="">
                <div class="row">
                    <div class="col l6 s12">
                        <h5 class="white-text">Footer Content</h5>
                        <p class="grey-text text-lighten-4">You can use rows and columns here to organize your footer content.</p>
                    </div>
                    <div class="col l4 offset-l2 s12">
                        <h5 class="white-text">Links</h5>
                        <ul>
                            <li><a class="grey-text text-lighten-3" href="#!">Link 1</a></li>
                            <li><a class="grey-text text-lighten-3" href="#!">Link 2</a></li>
                            <li><a class="grey-text text-lighten-3" href="#!">Link 3</a></li>
                            <li><a class="grey-text text-lighten-3" href="#!">Link 4</a></li>
                        </ul>
                    </div>
                </div>
            </div>
          <div class="footer-copyright">
            <div class="row">
                © 2018 Purebred Swine Registry PH
                {{-- <a class="grey-text text-lighten-4 right" href="#!">More Links</a> --}}
            </div>
          </div>
        </footer>
    @endauth

    {{-- Footer for guest users --}}
    @guest
        <footer class="page-footer">
            <div class="container">
                <div class="row">
                    <div class="col l6 s12">
                        <h5 class="white-text">Footer Content</h5>
                        <p class="grey-text text-lighten-4">You can use rows and columns here to organize your footer content.</p>
                    </div>
                    <div class="col l4 offset-l2 s12">
                        <h5 class="white-text">Links</h5>
                        <ul>
                            <li><a class="grey-text text-lighten-3" href="#!">Link 1</a></li>
                            <li><a class="grey-text text-lighten-3" href="#!">Link 2</a></li>
                            <li><a class="grey-text text-lighten-3" href="#!">Link 3</a></li>
                            <li><a class="grey-text text-lighten-3" href="#!">Link 4</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="footer-copyright">
                <div class="container">
                    © 2017 Purebred Swine Registry PH
                    {{-- <a class="grey-text text-lighten-4 right" href="#!">More Links</a> --}}
                </div>
            </div>
        </footer>
    @endguest

    <!-- Scripts -->
    <script src="{{ asset('js/manifest.js') }}"></script>
    <script src="{{ asset('js/vendor.js') }}"></script>
    <script src="{{ asset('js/app.js') }}"></script>
    @yield('customScript')

</body>
</html>
