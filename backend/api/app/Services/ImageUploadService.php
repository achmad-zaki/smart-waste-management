<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ImageUploadService
{
    /**
     * Upload an image to Cloudinary (or fallback to local public storage).
     */
    public function upload(UploadedFile $file, string $folder = 'smart-waste'): string
    {
        $cloudName = config('services.cloudinary.cloud_name');
        $apiKey = config('services.cloudinary.api_key');
        $apiSecret = config('services.cloudinary.api_secret');

        // Check if Cloudinary credentials are fully configured
        if ($cloudName && $apiKey && $apiSecret) {
            try {
                $timestamp = time();
                $signature = sha1("folder={$folder}&timestamp={$timestamp}{$apiSecret}");

                $response = Http::timeout(15)
                    ->attach('file', file_get_contents($file->getRealPath()), $file->getClientOriginalName())
                    ->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
                        'api_key' => $apiKey,
                        'timestamp' => $timestamp,
                        'signature' => $signature,
                        'folder' => $folder,
                    ]);

                if ($response->successful()) {
                    $json = $response->json();

                    return $json['secure_url'] ?? $json['url'];
                }

                Log::warning('Cloudinary upload returned error, falling back to local storage', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
            } catch (\Throwable $e) {
                Log::error('Exception during Cloudinary upload, falling back to local storage: '.$e->getMessage());
            }
        }

        // Fallback: Store locally on the public disk
        $path = $file->store($folder, 'public');

        return url(Storage::url($path));
    }
}
