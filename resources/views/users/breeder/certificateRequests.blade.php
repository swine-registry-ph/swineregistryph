@extends('users.breeder.home')

@section('title')
    | Certificate Requests
@endsection

@section('content')

<div class="">
    <div class="row">
        <certificate-requests-breeder
            :user="{{ Auth::user()->userable()->first() }}" 
            :custom-certificate-requests="{{ $customCertificateRequests }}"
            :current-filter-options="{{ $currentFilterOptions }}"
            :farm-options="{{ $farmOptions }}"
            :view-url="'{{ route('breederCertificate') }}'"
        >  
        </certificate-requests-breeder>
    </div>
</div>

@endsection


@section('customScript')
@endsection
