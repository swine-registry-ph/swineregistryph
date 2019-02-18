@extends('users.admin.home')

@section('title')
    | Certificate Requests
@endsection

@section('content')

<div class="">
    <div class="row">
        <certificate-requests-admin
            :user="{{ Auth::user()->userable()->first() }}" 
            :custom-certificate-requests="{{ $customCertificateRequests }}"
            :current-filter-options="{{ $currentFilterOptions }}"
            :view-url="'{{ route('adminCertificate') }}'"
            :photo-url="'{{ asset('storage/images/payments') }}'"
        >  
        </certificate-requests-admin>
    </div>
</div>

@endsection


@section('customScript')
@endsection
