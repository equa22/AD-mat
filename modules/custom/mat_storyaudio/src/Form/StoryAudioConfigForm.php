<?php
 
/**
 
 * @file
 
 * Contains \Drupal\mat_storyaudio\Form\StoryAudioConfigForm.
 
 */
 
namespace Drupal\mat_storyaudio\Form;
 
use Drupal\Core\Form\ConfigFormBase;
 
use Drupal\Core\Form\FormStateInterface;

use Drupal\file\Entity\File;
 
class StoryAudioConfigForm extends ConfigFormBase {
 
  /**
 
   * {@inheritdoc}
 
   */
 
  public function getFormId() {
 
    return 'mat_storyaudio_config_form';
 
  }
 
  /**
 
   * {@inheritdoc}
 
   */
 
  public function buildForm(array $form, FormStateInterface $form_state) {

    $form = parent::buildForm($form, $form_state);
 
    $config = $this->config('mat_storyaudio.settings');

    $user_content_value = $config->get('mat_storyaudio.user_content');
    
    $default_mp3 = $config->get('mat_storyaudio.audio_file_mp3');

    $default_ogg = $config->get('mat_storyaudio.audio_file_ogg');
    
    $form['title_admin'] = array(
      '#type' => 'inline_template',
      '#template' => '<h2>Story landing page: Audio settings</h2>'
    );

    $form['enable_audio'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Enable audio ?'),
      '#default_value' => $config->get('mat_storyaudio.enable_audio'),
      '#required' => FALSE
    );

    $form['audio_file_mp3'] = array(
      '#type' => 'managed_file',
      '#upload_location' => 'public://files/',
      '#multiple' => FALSE,
      '#title' => t('MP3 Audio File *'),
      '#description' => t('mp3 format only'),
      '#upload_validators' => array(
        'file_validate_extensions' => array('mp3'),
        'file_validate_size' => array(25600000)
      ),
      '#default_value' => [$default_mp3],
    );
    
    $form['audio_file_ogg'] = array(
      '#type' => 'managed_file',
      '#upload_location' => 'public://files/',
      '#multiple' => FALSE,
      '#title' => t('OGG Audio File *'),
      '#description' => t('ogg format only'),
      '#upload_validators' => array(
        'file_validate_extensions' => array('ogg'),
        'file_validate_size' => array(25600000)
      ),
      '#default_value' => [$default_ogg],
    );


 
 
    return $form;
 
  }
 
  /**
 
   * {@inheritdoc}
 
   */
 
  public function submitForm(array &$form, FormStateInterface $form_state) {
 
    $config = $this->config('mat_storyaudio.settings');
    
    $config->set('mat_storyaudio.enable_audio', $form_state->getValue('enable_audio'));
    
    $fid_mp3 = reset($form_state->getValue('audio_file_mp3'));
    $fid_ogg = reset($form_state->getValue('audio_file_ogg'));
    $get_mp3 = File::load($fid_mp3);
    $get_ogg = File::load($fid_ogg);
  

    $config->set('mat_storyaudio.audio_file_mp3', $get_mp3->id());
    $config->set('mat_storyaudio.audio_file_ogg', $get_ogg->id());
    
    $config->save();
 
    return parent::submitForm($form, $form_state);
 
  }
 
  /**
 
   * {@inheritdoc}
 
   */
 
  protected function getEditableConfigNames() {
 
    return [
 
      'mat_storyaudio.settings',
 
    ];
 
  }
 
}