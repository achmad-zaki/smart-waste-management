<?php

namespace App\Services;

use App\Enums\WasteCategory;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\HttpException;

class MlPredictionService
{
    /**
     * Send image to FastAPI service for category prediction.
     *
     * @return array{predicted_category: string, confidence_score: float}
     *
     * @throws HttpException
     */
    public function predict(UploadedFile $file): array
    {
        $baseUrl = config('services.fastapi.base_url', 'http://127.0.0.1:8001');
        $timeout = config('services.fastapi.timeout', 10);

        try {
            $response = Http::timeout($timeout)
                ->attach('image', file_get_contents($file->getRealPath()), $file->getClientOriginalName())
                ->post("{$baseUrl}/predict");

            if ($response->successful()) {
                $data = $response->json();
                $prediction = $data['prediction'] ?? $data['data'] ?? [];

                $category = $prediction['category'] ?? $prediction['predicted_category'] ?? null;
                $confidence = $prediction['confidence'] ?? $prediction['confidence_score'] ?? 0.0;

                // Validate category returned
                $validCategories = array_column(WasteCategory::cases(), 'value');
                if (! in_array($category, $validCategories, true)) {
                    throw new HttpException(502, 'Invalid prediction result from machine learning service.');
                }

                return [
                    'predicted_category' => $category,
                    'confidence_score' => round((float) $confidence, 4),
                ];
            }

            Log::error('ML service returned error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            throw new HttpException(503, 'Machine learning service is currently unavailable.');
        } catch (\Throwable $e) {
            if ($e instanceof HttpException) {
                throw $e;
            }

            Log::error('Could not connect to ML service: '.$e->getMessage());
            throw new HttpException(503, 'Machine learning service is currently unavailable.');
        }
    }
}
