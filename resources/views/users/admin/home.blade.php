@extends('layouts.app')

@section('title')
    | Admin - Home
@endsection

@section('sidebar')
    <ul id="slide-out" class="side-nav fixed">
        <li><a href="#!">View Registered Swine</a></li>
        <li><a href="#!">Manage Accredited Farms</a></li>
        <li><a href="#!">Manage Form fields</a></li>
        <li><a href="#!">Manage Breeds</a></li>
        <li><a href="#!">Reports</a></li>
    </ul>
@endsection

@section('content')

<div class="row main-logged-in">
    <div class="col s9 blue-grey lighten-5" style="height:100rem;">
        <h1>Welcome, {{ Auth::user()->name }}!</h1>

        <div class="row">
        </div>
    </div>
</div>

@endsection
