@extends('users.genomics.home')

@section('title')
    | View Laboratory Results
@endsection

@section('content')

<div class="row">
    <div class="col s10 offset-s1">
        <view-laboratory-results :custom-lab-results="{{ $customLabResults }}"></view-laboratory-results>
    </div>
</div>

@endsection


@section('customScript')
@endsection
