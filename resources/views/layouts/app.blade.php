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
    {{-- <link href="{{ asset('css/app.css') }}" rel="stylesheet">  --}}
    <link href="{{ asset('css/materialize.min.css') }}" rel="stylesheet">
    <link href="{{ asset('css/icon.css') }}" rel="stylesheet" type="text/css">

    <!-- Scripts -->
    <script>
        window.Laravel = {!! json_encode([
            'csrfToken' => csrf_token(),
        ]) !!};
    </script>
</head>
<body>

    <nav class="blue-grey">
        <div class="nav-wrapper container">
            <a href="#" class="brand-logo">{{ config('app.name', 'Laravel') }}</a>
            <ul id="nav-mobile" class="right hide-on-med-and-down">
                @if (Auth::guest())
                    <li><a href="{{ url('login') }}">Login</a></li>
                    <li><a href="{{ url('register') }}">Register</a></li>
                @else
                    <li><a href="{{ url('manage-swine') }}">Manage Swine</a></li>
                @endif
            </ul>
        </div>
    </nav>

    @yield('content')

    <!-- Scripts -->
    {{-- <script src="{{ asset('js/app.js') }}"></script> --}}
    <script src="{{ asset('js/jquery.min.js') }}"></script>
    <script src="{{ asset('js/materialize.min.js') }}"></script>
    @yield('customScript')

</body>
</html>
