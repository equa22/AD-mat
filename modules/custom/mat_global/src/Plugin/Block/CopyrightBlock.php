<?php

namespace Drupal\mat_global\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Block\BlockPluginInterface;

/**
 * Provides a 'Copyright' Block.
 *
 * @Block(
 *   id = "copyright_block_footer",
 *   admin_label = @Translation("Footer Copyright"),
 *   category = @Translation("Custom"),
 * )
 */
class CopyrightBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $form = parent::blockForm($form, $form_state);
    $config = $this->getConfiguration();
    $form['legal_terms_url'] = array (
      '#type' => 'textfield',
      '#title' => t('Legal terms URL:'),
      '#default_value' => isset($config['legal_terms_url']) ? $config['legal_terms_url'] : '',
    );
    return $form;
  }
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->setConfigurationValue('legal_terms_url', $form_state->getValue('legal_terms_url'));
  }

  public function build() {
    $config = $this->getConfiguration();
    $legal_terms_url = isset($config['legal_terms_url']) ? $config['legal_terms_url'] : '';

    $year = date('Y');
    $markup = '<p>&copy;'.$year.' '.t('All rights reserved.').' <a href="'.$legal_terms_url.'">'.t('Legal terms').'</a></p>';
    return [
      '#markup' => $markup,
      '#cache' => [
        'max-age' => 0
      ]
    ];
  }

}
