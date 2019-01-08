@extends('users.breeder.home')

@section('title')
    | Certificate Requests
@endsection

@section('content')

<div class="">
    <div class="row">
        <certificate-requests-breeder
            :user="{{ Auth::user()->userable()->first() }}" 
            :approved-swines="{{ $approvedSwines }}"
            :current-filter-options="{{ $currentFilterOptions }}"
            :farm-options="{{ $farmOptions }}"
            :view-url="'{{ route('breederInspection') }}'"
        >  
        </certificate-requests-breeder>
    </div>
</div>

@endsection


@section('customScript')
@endsection
