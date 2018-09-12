@extends('users.genomics.home')

@section('title')
    | Register Genetic Information
@endsection

@section('content')

<div class="row">
    <div class="col s10 offset-s1">
        <register-laboratory-results :farmoptions="{{ $farmOptions }}"> </register-laboratory-results>
    </div>
</div>

@endsection


@section('customScript')
@endsection
