<?php

namespace Drupal\mat_webform\Form;

use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\HtmlCommand;
use Drupal\Core\Config\ConfigFactory;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\mat_webform\Service\CentralRegistryApi;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class CentralRegistryApiSettings.
 */
class CentralRegistryApiSettings extends ConfigFormBase {

  /**
   * @var \Drupal\mat_webform\Service\CentralRegistryApi
   */
  protected $centralApi;

  /**
   * @var ConfigFactory
   */
  protected $config;

  public function __construct(ConfigFactoryInterface $config_factory, CentralRegistryApi $centralApi) {
    parent::__construct($config_factory);
    $this->centralApi = $centralApi;
    $this->config = $this->configFactory->getEditable('mat_webform.central_registry_api');
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory'),
      $container->get('mat_webform.central_registry_api')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'central_registry_api_settings';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'mat_webform.central_registry_api',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {

    $config = $this->configFactory->getEditable('mat_webform.central_registry_api');

    $form['endpoint_uri_stage'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Staging API endpoint'),
      '#description' => $this->t('Enter the staging API URI excluding trailing slash.'),
      '#maxlength' => 256,
      '#size' => 80,
      '#default_value' => $config->get('endpoint_uri_stage'),
      '#required' => TRUE
    ];

    $form['endpoint_uri_production'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Production API endpoint'),
      '#description' => $this->t('Enter the production API URI excluding trailing slash.'),
      '#maxlength' => 256,
      '#size' => 80,
      '#default_value' => $config->get('endpoint_uri_production'),
      '#required' => TRUE
    ];

    $form['debug_mode'] = [
      '#type' => 'checkbox',
      '#title' => 'Debug mode',
      '#default_value' => $config->get('debug_mode'),
      '#return_value' => '1',
      '#description' => 'Debug mode enables API connection logging. Disable this when in production!'
    ];

    $form['environment'] = [
      '#type' => 'checkbox',
      '#title' => 'Production environment',
      '#default_value' => $config->get('environment'),
      '#return_value' => CentralRegistryApi::ENV_PRODUCTION,
      '#description' => 'Enable this option when in production to use production API endpoint.'
    ];

    $form['connection_output'] = [
      '#type' => 'markup',
      '#markup' => '<div id="connectionOutput"></div>',
    ];

    $form['actions']['connection'] = [
      '#type' => 'button',
      '#title' => $this->t('Test API connection'),
      '#value' => $this->t('Test API connection'),
      '#ajax' => [
        'callback' => '::callbackTestConnection'
      ]
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    parent::validateForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);

    $config = $this->configFactory->getEditable('mat_webform.central_registry_api');
    $config->set('endpoint_uri_stage', $form_state->getValue('endpoint_uri_stage'))
      ->set('endpoint_uri_production', $form_state->getValue('endpoint_uri_production'))
      ->set('debug_mode', $form_state->getValue('debug_mode'))
      ->set('environment', $form_state->getValue('environment'))
      ->save();
  }

  public function callbackTestConnection(array $form, FormStateInterface $form_state) {
    $responseMessage = ">>> Connecting to service ... <br>";

    // Connect to service API
    try {
      $token = $this->centralApi->getAccessToken();
      $this->centralApi->setDebugMessage("Access token returned: {$token}");
    } catch (\Exception $e) {
      if ($this->config->get('debug_mode')) {
        $responseMessage .= $e->getMessage();
        $responseMessage .= $e->getTraceAsString();
      } else {
        $responseMessage .= 'Error occured connecting to a remote service. Turn debug mode for more info.';
      }
    }

    // Append API client debug messages
    if ($this->config->get('debug_mode'))
      $responseMessage .= $this->centralApi->getDebugMessages(true);

    // Send JSON output
    $response = new AjaxResponse();
    $response->addCommand(new HtmlCommand('#connectionOutput', $responseMessage));

    return $response;
  }
}
