<?php

namespace Drupal\mat_global\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\node\Entity\Node;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;

/**
 * Class MatGlobalSettingsForm.
 */
class MatGlobalSettingsForm extends ConfigFormBase {

  /**
   * Drupal\Core\Entity\EntityTypeManagerInterface definition.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;
  /**
   * Constructs a new MatGlobalSettingsForm object.
   */
  public function __construct(
    ConfigFactoryInterface $config_factory,
      EntityTypeManagerInterface $entity_type_manager
    ) {
    parent::__construct($config_factory);
        $this->entityTypeManager = $entity_type_manager;
  }

  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory'),
            $container->get('entity_type.manager')
    );
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'mat_global.matglobalsettings',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'mat_global_settings_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('mat_global.matglobalsettings');
    $form['homepage_landing_page'] = [
      '#type' => 'entity_autocomplete',
      '#title' => $this->t('Homepage landing page'),
      '#default_value' => Node::load($config->get('homepage_landing_page')),
      '#target_type' => 'node',
      '#required' => TRUE,
    ];
    $form['why_give_live_landing_page'] = [
      '#type' => 'entity_autocomplete',
      '#title' => $this->t('Why give live landing page'),
      '#default_value' => Node::load($config->get('why_we_give_live_landing_page')),
      '#target_type' => 'node',
      '#required' => TRUE,
    ];
    $form['what_we_do_landing_page'] = [
      '#type' => 'entity_autocomplete',
      '#title' => $this->t('What we do landing page'),
      '#default_value' => Node::load($config->get('what_we_do_landing_page')),
      '#target_type' => 'node',
      '#required' => TRUE,
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

    $this->config('mat_global.matglobalsettings')
      ->set('homepage_landing_page', $form_state->getValue('homepage_landing_page'))
      ->set('why_we_give_live_landing_page', $form_state->getValue('why_give_live_landing_page'))
      ->set('what_we_do_landing_page', $form_state->getValue('what_we_do_landing_page'))
      ->save();
  }

}
