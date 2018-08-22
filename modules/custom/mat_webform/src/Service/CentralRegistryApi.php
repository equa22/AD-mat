<?php

namespace Drupal\mat_webform\Service;

use Drupal\Core\Config\Config;
use Drupal\Core\Config\ConfigFactory;
use Firebase\JWT\JWT;
use GuzzleHttp\Client;

/**
 * Class CentralRegistryApi.
 *
 * Thin Drupal service wrapper around the JWT library.
 *
 */
class CentralRegistryApi {

  /*
   * Key of registered application
   */
  protected $iss = NULL;

  /**
   * API base url
   */
  protected $aud = NULL;

  /**
   * Time of request in UNIX time
   */
  protected $iat = NULL;

  /*
   * Guzzle client for sending HTTP requests
   */
  protected $client = NULL;

  /**
   * @var array Debug messages.
   */
  protected $debugMessages = [];

  /**
   * Access token needed for sending POST requests
   */
  protected $access_token = NULL;

  /**
   * Production environment indicator
   */
  const ENV_PRODUCTION = 1;

  /**
   * Stage environment indicator
   */
  const ENV_DEVELOPMENT = 0;

  /**
   * Debug mode indicator.
   * @var boolean
   */
  protected $debugMode = false;

  /**
   * @var Config
   */
  protected $config;

  /**
   * Full path to private key.
   * @var string
   */
  protected $privateKey;

  public function __construct(ConfigFactory $config) {
    $this->config = $config->get('mat_webform.central_registry_api');

    // Prepare client options
    $this->aud = ($this->config->get('environment') === self::ENV_PRODUCTION) ? $this->config->get('endpoint_uri_production') : $this->config->get('endpoint_uri_stage');
    $this->iat = time();
    $this->debugMode = (boolean) $this->config->get('debug_mode');
    $this->privateKey = __DIR__. '/../private_key.pem';
    $jwtToken = $this->getJwtToken();

    $this->setDebugMessage("Init HTTP client -> aud:{$this->aud} ");
    $this->client = new Client([
      'base_uri' => $this->aud,
      'headers' => [
        'Content-Type' => 'application/json',
        'Accept' => 'application/json',
        'Authorization' => "Bearer {$jwtToken}"
      ],
      'verify' => FALSE,
      'connect_timeout' => 60,
      'timeout' => 600,
      'debug' => 0
    ]);
  }

  /**
   * Returns the JWT token
   *
   * @return string
   */
  public function getJwtToken(){
    $privateKey = file_get_contents($this->privateKey);

    $this->setDebugMessage('Reading private key from: '. $this->privateKey);

    if ($privateKey === false) {
      throw new \Exception("Unable to read private key.");
    }

    $key = $privateKey;
    $token = array(
      "iss" => "t8I63gYYoiONZjwd8i2n",
      "aud" => $this->aud,
      "iat" => $this->iat
    );

    // Create JWT token
    $this->setDebugMessage("Private key for JWT token: {$key}");
    $jwtToken = JWT::encode($token, $key, 'RS256');
    $this->setDebugMessage("JWT token created: {$jwtToken}");

    return $jwtToken;
  }

  /**
   * Returns the access token
   *
   * @throws \GuzzleHttp\Exception\GuzzleException
   */
  public function getAccessToken(){
    $jwt = $this->getJwtToken();

    # PRODUCTION MAYBE? $url = 'https://www.registerme.org/api/token';

    $this->setDebugMessage("Request access token from: " . $this->getRequestUrl('token'));

    try {
      //$response = $this->client->request('GET', $this->getRequestUrl(), ['auth' => $jwt]);
      $options = [
        'Authorization' => "Bearer {$jwt}"
      ];
      $response = $this->client->request('POST', $this->getRequestUrl('token'));

      $this->setDebugMessage('Endpoint response code: '. $response->getStatusCode());
      $this->setDebugMessage('Response body: '. $response->getBody()->getContents());

      if($response->getStatusCode() === 200 && $response->getReasonPhrase() === 'OK'){
        $token = json_decode($response->getBody()->getContents());
        return $this->access_token = $token;
      }
    } catch (\Exception $e) {
      $this->setDebugMessage($e->getMessage());
    }

  }

  /**
   * Send the POST request and save registrant
   *
   * @param $registrantData
   *
   * @throws \GuzzleHttp\Exception\GuzzleException
   */
  public function saveRegistrant($registrantData){
    if (empty($registrantData)){
      throw new \InvalidArgumentException('$registrantData cannot be empty');
    }

    $this->getAccessToken();

    if(isset($this->access_token)){
      $url = '/registrants';

      return $this->client->request('POST', $url, [
        'Authorization' => 'Bearer ' . $this->access_token,
        'form_params' => [
          'registrant' => $registrantData
        ]
      ]);
    }
  }

  /**
   * Set debug message.
   * @param string $message
   */
  public function setDebugMessage($message) {
    $this->debugMessages[] = '['. date('d.m.Y h:i:s'). '] '. $message;
  }

  /**
   * Return client debug messages.
   * @param bool $asString If true messages are returned as string. Default: array of messages.
   * @return mixed
   */
  public function getDebugMessages($asString = false) {
    if (!$this->debugMode) {
      return null;
    }

    if ($asString) {
      $output = '';
      foreach ($this->debugMessages as $message) {
        $output .= "$message<br>";
      }
      return $output;
    }
    return $this->debugMessages;
  }

  /**
   * Get request URL based on API endpoint.
   * @param string $path Command to execute excl. trailing slash: e.g. 'token'
   * @return string
   */
  public function getRequestUrl($path = '') {
    if ($path)
      return "{$this->aud}/{$path}";
    return $this->aud;
  }
}
