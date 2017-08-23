@extends('layouts.app')

@section('title')
    | Register
@endsection

@section('content')
<div class="container">
    <div class="row"></div>
    <div class="row"></div>
    <div class="row"></div>
    <div class="row">
        <div class="col s6 offset-s3">
            <div class="row">
                <form role="form" method="POST" action="{{ route('register') }}">
                    {{ csrf_field() }}
                    <div class="input-field col s12">
                        <input id="name" type="text" class="validate" name="name" value="{{ old('name') }}">
                        <label for="name">Name</label>
                    </div>
                    <div class="input-field col s12">
                        <input id="email" type="text" class="validate" name="email" value="{{ old('email') }}">
                        <label for="email">Email</label>
                    </div>
                    <div class="input-field col s12">
                        <input id="password" type="password" class="validate" name="password">
                        <label for="password">Password</label>
                    </div>
                    <div class="input-field col s12">
                        <input id="password-confirm" type="password" class="validate" name="password_confirmation">
                        <label for="password-confirm">Confirm Password</label>
                    </div>
                    <button type="submit" class="btn waves-effect waves-light indigo right"> Register
                        <i class="material-icons right">send</i>
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection
