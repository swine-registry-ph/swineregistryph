@extends('users.breeder.home')

@section('title')
    | Inspection Requests
@endsection

@section('content')

<div class="">
    <div class="row">
        <inspection-requests-breeder 
            :inspection-requests="{{ $customInspectionRequests }}"
            :current-filter-options="{{ $currentFilterOptions }}"
            :view-url="'{{ route('breederInspection') }}'"
        >  
        </inspection-requests-breeder>
    </div>
</div>

@endsection


@section('customScript')
@endsection
