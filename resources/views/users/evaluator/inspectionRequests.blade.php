@extends('users.evaluator.home')

@section('title')
    | Inspection Requests
@endsection

@section('content')

<div class="">
    <div class="row">
        <inspection-requests-evaluator
            :custom-inspection-requests="{{ $customInspectionRequests }}"
            :current-filter-options="{{ $currentFilterOptions }}"
            :view-url="'{{ route('evaluatorInspection') }}'"
        > 
        </inspection-requests-evaluator>
    </div>
</div>

@endsection


@section('customScript')
@endsection
