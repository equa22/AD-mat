<?php

namespace Drupal\mat_global\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\user\Entity\Role;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;

/**
 * Class MATGlobalSettings.
 */
class MATGlobalSettings extends ConfigFormBase {

  /**
   * Drupal\Core\Entity\EntityTypeManagerInterface definition.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;
  /**
   * Constructs a new MATGlobalSettings object.
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
    return 'mat_global_settings';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $roles = Role::loadMultiple();
    $config = $this->config('mat_global.matglobalsettings');
    $form['title'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Add all paragraphs permission to the role when new content type is created'),
    ];


    /* @var Role $role */
    foreach ($roles as $role) {
      $roleid = $role->id();
      $form['title']['role'][$role->id()] = [
        '#type' => 'select',
        '#title' => $role->label(),
        '#options' => [
          'yes' => $this->t('Yes'),
          'no' => $this->t('No'),
        ],
        '#default_value' => $config->get('role'),
      ];
    }

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
      ->set('title', $form_state->getValue('title'))
      ->set('role', $form_state->getValue('role'))
      ->save();
  }

}
