@extends('users.genomics.home')

@section('title')
    | Register Genetic Information
@endsection

@section('content')

<div class="row">
    <div class="col s10 offset-s1">
        <register-genetic-info :farmoptions="{{ $farmOptions }}"> </register-genetic-info>
    </div>
</div>

@endsection


@section('customScript')
@endsection
