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

</head>
<body>
    <div id="app">
        <nav class="blue-grey">
            <div class="nav-wrapper container">
                <a href="#" class="brand-logo">{{ config('app.name', 'Laravel') }}</a>
                <ul id="nav-mobile" class="right hide-on-med-and-down">
                    @if (Auth::guest())
                        <li><a href="{{ url('login') }}">Login</a></li>
                        <li><a href="{{ url('register') }}">Register</a></li>
                    @else
                        <li><a href="{{ url('home') }}">{{ Auth::user()->name }}</a></li>
                        <li><a href="{{ url('manage-swine') }}">Manage Swine</a></li>
                        <li>
                            <a href="{{ url('manage-swine') }}" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                                Logout
                            </a>
                            <form id="logout-form" method="POST" action="{{ route('logout') }}">
                                {{ csrf_field() }}
                            </form>
                        </li>
                    @endif
                </ul>
            </div>
        </nav>

        @yield('content')

    </div>
    
    <!-- Scripts -->
    <script src="{{ asset('js/manifest.js') }}"></script>
    <script src="{{ asset('js/vendor.js') }}"></script>
    <script src="{{ asset('js/app.js') }}"></script>
    @yield('customScript')

</body>
</html>
