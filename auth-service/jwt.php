<?php
require_once 'config.php';

class JWT {
    private $secret;
    
    public function __construct() {
        $this->secret = JWT_SECRET;
    }
    
    public function generate($data) {
        $header = $this->base64UrlEncode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        
        $payload = [
            'iat' => time(),
            'exp' => time() + JWT_EXPIRE,
            'data' => $data
        ];
        $payload = $this->base64UrlEncode(json_encode($payload));
        
        $signature = $this->base64UrlEncode(hash_hmac('sha256', "$header.$payload", $this->secret, true));
        
        return "$header.$payload.$signature";
    }
    
    public function validate($token) {
        $parts = explode('.', $token);
        
        if (count($parts) != 3) {
            return false;
        }
        
        list($header, $payload, $signature) = $parts;
        
        $verified = $this->base64UrlEncode(hash_hmac('sha256', "$header.$payload", $this->secret, true));
        
        if ($verified !== $signature) {
            return false;
        }
        
        $decoded = json_decode($this->base64UrlDecode($payload), true);
        
        if ($decoded['exp'] < time()) {
            return false;
        }
        
        return $decoded['data'];
    }
    
    private function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    private function base64UrlDecode($data) {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($data)) % 4));
    }
} 