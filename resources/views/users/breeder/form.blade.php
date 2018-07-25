@extends('users.breeder.home')

@section('title')
    | Register Swine
@endsection

@section('content')

<div class="">
    <div class="row">
        <register-swine
            :breeds="{{ $breedOptions }}"
            :farmoptions="{{ $farmOptions }}"
            :uploadurl="'{{ route('uploadPhoto') }}'"
        >
        </register-swine>
    </div>
</div>

@endsection


@section('customScript')
@endsection
