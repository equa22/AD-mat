<?php

namespace Drupal\mat_webform\Service;

use Drupal\Core\Config\Config;
use Drupal\Core\Config\ConfigFactory;
use Firebase\JWT\JWT;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\RequestOptions;

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
   * JWT token "aud", if empty CentralRegistryApi::$aud will be used.
   * This property was added because JWT token can contain different aud than API endpoint to which requests are sent.
   *
   * @var string
   */
  protected $audJwtToken;

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
   * Access token needed for sending POST requests.
   * @var string
   */
  protected $accessToken = NULL;

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
   * Access token structure for DLA API endpoint authorization.
   *
   * @var array Access token returned from the DLA API. Structure consist from the following keys:
   * - access_token: access token used for making requests.
   * - expires_in: seconds to expire.
   * - token_type: auth scheme used (default: bearer).
   */
  protected $accessTokenStructure;

  /**
   * Full path to private key.
   * @var string
   */
  protected $privateKey;

  public function __construct(ConfigFactory $config) {
    $this->config = $config->get('mat_webform.central_registry_api');

    // Prepare client options
    $this->aud = ($this->config->get('environment') === self::ENV_PRODUCTION) ? $this->config->get('endpoint_uri_production') : $this->config->get('endpoint_uri_stage');
    $this->audJwtToken = ($this->config->get('endpoint_jwt_token')) ? $this->config->get('endpoint_jwt_token') : $this->aud;
    $this->iss = ($this->config->get('application_key_iss')) ? $this->config->get('application_key_iss') : null;
    $this->iat = time();

    $this->debugMode = (boolean) $this->config->get('debug_mode');
    $this->privateKey = __DIR__. '/../private_key.pem';
    $jwtToken = $this->getJwtToken();

    $this->setDebugMessage("Init HTTP client -> aud:{$this->aud} ");
    $this->client = new Client([
      'base_uri' => $this->aud,
      'headers' => [
        'Content-Type' => 'application/json',
        'Accept' => 'application/json'
      ],
      'verify' => FALSE,
      'connect_timeout' => 60,
      'timeout' => 600,
      'debug' => 0,
      'allow_redirects' => true
    ]);
  }

  /**
   * Generate JWT token.
   *
   * @throws \Exception
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
      "iss" => $this->iss,
      "aud" => $this->audJwtToken,
      "iat" => $this->iat
    );

    // Create JWT token
    $this->setDebugMessage("JWT token aud: " . $this->audJwtToken);
    $this->setDebugMessage("Private key for JWT token: {$key}");
    $jwtToken = JWT::encode($token, $key, 'RS256');
    $this->setDebugMessage("JWT token created: {$jwtToken}");

    return $jwtToken;
  }

  /**
   * Get access token for making API request using Bearer authentication scheme.
   * Returned token structure is than stored inside CentralRegistryApi::$accessTokenStructure.
   *
   * NOTE: This method is only for storing access token structure, use CentralRegistryApi::getAccessToken() when making requests to API with access token.
   *
   * @throws \GuzzleHttp\Exception\GuzzleException
   */
  protected function requestAccessToken(){
    // Generate JWT token
    $jwt = $this->getJwtToken();

    try {
      $this->setDebugMessage("Request access token from: " . $this->getRequestUrl('token'));
      $options = [
        RequestOptions::JSON => [
          'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          'assertion'  => $jwt
        ]
      ];

      $response = $this->client->request('POST', $this->getRequestUrl('token'), $options);

      $this->setDebugMessage('Endpoint response code: '. $response->getStatusCode());
      $responseBody = $response->getBody()->getContents();
      $this->setDebugMessage('Response body: '. $responseBody);

      if($response->getStatusCode() === 200 && $response->getReasonPhrase() === 'OK') {

        $token = json_decode($responseBody, true);
        $this->accessTokenStructure = $token;

        $this->setDebugMessage('Returned access token structure: '. print_r($token, true));

      }
    } catch (\Exception $e) {
      $this->setDebugMessage($e->getMessage());
    }
  }

  /**
   * Get access token used for making API requests.
   * @return mixed
   * @throws \GuzzleHttp\Exception\GuzzleException
   */
  public function getAccessToken() {
    #return "AeDv7z_Pjiki-YN__hz_Gwi-RT8";
    // Request token for auth from API.
    $this->requestAccessToken();

    if (!isset($this->accessTokenStructure['access_token']))
     throw new \Exception("Failed to return access_token from accessTokenStructure");

    return $this->accessTokenStructure['access_token'];
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
   * Execute API action.
   * @param string $action API action e.g.: /registrants,
   * Supported actions
   * - registrants: create new registrant
   *
   * @param array $params Additional action parameters. E.g.: id
   * @param string $method HTTP method to be executed.
   *
   * @return Response
   *
   * @throws \Exception
   */
  public function execute($action, array $params = [], $method = 'POST') {
    // First we request access token
    try {

      $accessToken = $this->getAccessToken();
      $formParameters = [];

      // Prepare action call parameters for form request body
      switch ($action) {
        case 'registrants':
          $params['cancontact'] = (isset($params['cancontact']['0']) && $params['cancontact']['0'] == 1) ? true : false;
          $params['dob'] = date("m/d/Y", strtotime($params['dob']));
          $formParameters['registrant'] = $params;
        break;
      }

      // Log the executed API call
      $this->setDebugMessage("Prepared POST parameters: ". print_r($formParameters, true));
      $this->setDebugMessage("Executing API action: {$action}");

      // Execute call
      $response = $this->client->request('POST', $this->getRequestUrl($action), [
        'headers' => [
          'Authorization' => "Bearer $accessToken",
          'Content-Type' => 'application/json',
          'Accept' => '*/*'
        ],
        RequestOptions::JSON  => $formParameters
      ]);

      return $response;

    } catch (\Exception $e) {
      watchdog_exception('mat_webform', $e, $e->getMessage());
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
