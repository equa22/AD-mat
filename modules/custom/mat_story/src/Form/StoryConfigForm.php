<?php
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
    $story_submitted = $config->get('mat_story.story_submitted');
    $story_submission_introduction = $config->get('mat_story.story_submission_introduction');

    $form['title_admin'] = array(
      '#type' => 'inline_template',
      '#template' => '<h2>Admin Config</h2><p>Add recipient email addresses, separated with commas as shown below:<br> John Doe &lt;john.doe@domain.com&gt;, Mike Smith &lt;mike.smith@domain.com&gt;'
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

    $form['story_submission_introduction'] = array(
      '#type' => 'text_format',
      '#title' => $this->t('Introduction to the Story Submission form'),
      '#description' => $this->t('Text displayed at the top of the Story Submission page.'),
      '#default_value' => $story_submission_introduction['value'],
      '#format' => 'rich_editor',
      '#required' => TRUE
    );

    $form['story_submitted'] = array(
      '#type' => 'text_format',
      '#title' => $this->t('Confirmation message'),
      '#description' => $this->t('Text displayed to user when form has been successfully submitted.'),
      '#default_value' => $story_submitted['value'],
      '#format' => 'rich_editor',
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
    $config->set('mat_story.story_submitted', $form_state->getValue('story_submitted'));
    $config->set('mat_story.story_submission_introduction', $form_state->getValue('story_submission_introduction'));
    $config->save();
    drupal_flush_all_caches();
 
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
