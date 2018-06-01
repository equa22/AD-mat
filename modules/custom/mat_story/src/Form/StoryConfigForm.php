<?php
 
/**
 
 * @file
 
 * Contains \Drupal\mat_story\Form\StoryConfigForm.
 
 */
 
namespace Drupal\mat_story\Form;
 
use Drupal\Core\Form\ConfigFormBase;
 
use Drupal\Core\Form\FormStateInterface;
 
class StoryConfigForm extends ConfigFormBase {
 
  /**
 
   * {@inheritdoc}
 
   */
 
  public function getFormId() {
 
    return 'mat_story_config_form';
 
  }
 
  /**
 
   * {@inheritdoc}
 
   */
 
  public function buildForm(array $form, FormStateInterface $form_state) {

    $form = parent::buildForm($form, $form_state);
 
    $config = $this->config('mat_story.settings');
    $user_content_value = $config->get('mat_story.user_content');
    
    $form['title_admin'] = array(
      '#type' => 'inline_template',
      '#template' => '<h2>Admin Config</h2><p>Add recepients <b>admins</b> email addresses separated with comma as shown on example below:<br> John Doe &lt;john.doe@domain.com&gt;, Mike Smith &lt;mike.smith@domain.com&gt;'
    );

    $form['email'] = array(
      '#type' => 'textarea',
      '#title' => $this->t('Email addresses'),
      '#default_value' => $config->get('mat_story.email'),
      '#required' => TRUE
    );

    $form['title_user'] = array(
      '#type' => 'inline_template',
      '#template' => '<h2 style="margin-top: 30px;">User Config</h2>'
    );

    $form['user_title'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Email title'),
      '#default_value' => $config->get('mat_story.user_title'),
      '#required' => TRUE
    );

    $form['user_content'] = array(
      '#type' => 'text_format',
      '#title' => $this->t('Email content'),
      '#format' => 'rich_editor',
      '#default_value' => $user_content_value['value'],
      '#required' => TRUE
    );
 
 
    return $form;
 
  }
 
  /**
 
   * {@inheritdoc}
 
   */
 
  public function submitForm(array &$form, FormStateInterface $form_state) {
 
    $config = $this->config('mat_story.settings');
 
    $config->set('mat_story.email', $form_state->getValue('email'));
    $config->set('mat_story.user_title', $form_state->getValue('user_title'));
    $config->set('mat_story.user_content', $form_state->getValue('user_content'));
 
    $config->save();
 
    return parent::submitForm($form, $form_state);
 
  }
 
  /**
 
   * {@inheritdoc}
 
   */
 
  protected function getEditableConfigNames() {
 
    return [
 
      'mat_story.settings',
 
    ];
 
  }
 
}