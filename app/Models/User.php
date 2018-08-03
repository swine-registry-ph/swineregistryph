<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'userable_id', 'userable_type'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];

    /**
     * Get all of the owning userable models
     */
    public function userable()
    {
        return $this->morphTo();
    }

    /**
     * Check if user is of type Breeder
     *
     * @return boolean
     */
    public function isBreeder()
    {
        return str_contains($this->userable_type, 'Breeder');
    }

    /**
     * Check if user is of type admin
     *
     * @return boolean
     */
    public function isAdmin()
    {
        return str_contains($this->userable_type, 'Admin');
    }

    /**
     * Check if user is of type genomics
     *
     * @return boolean
     */
    public function isGenomics()
    {
        return str_contains($this->userable_type, 'Genomics');
    }

    /**
     * Check if user is of type evaluator
     *
     * @return boolean
     */
    public function isEvaluator()
    {
        return str_contains($this->userable_type, 'Evaluator');
    }

    /**
     * Check User if it has a certain role
     *
     * @param   String  $role
     * @return  Boolean
     */
    public function hasRole($role)
    {
        if(is_string($role)){
            return str_contains(strtolower($this->userable_type), $role);
        }

        return false;
    }
}
