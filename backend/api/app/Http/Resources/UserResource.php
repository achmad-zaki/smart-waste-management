<?php

namespace App\Http\Resources;

use App\Enums\UserRole;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $roleValue = $this->role instanceof UserRole ? $this->role->value : $this->role;

        $data = [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $roleValue,
            'phone' => $this->phone,
        ];

        if (isset($this->waste_reports_count)) {
            $data['reports_count'] = $this->waste_reports_count;
        }

        if ($this->created_at) {
            $data['created_at'] = $this->created_at->toISOString();
        }

        return $data;
    }
}

