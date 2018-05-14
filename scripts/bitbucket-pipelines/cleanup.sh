#!/bin/sh

# Remove .git from modules
ls -la modules/contrib/media_entity_browser/
rm -Rf modules/contrib/media_entity_browser/.git

ls -la modules/contrib/install_profile_generator/
rm -Rf modules/contrib/install_profile_generator/.git

ls -la modules/contrib/paragraphs/
rm -Rf modules/contrib/paragraphs/.git

ls -la modules/contrib/slick_paragraphs/
rm -Rf modules/contrib/slick_paragraphs/.git

# Remove pipelines
rm -rf scripts/bitbucket-pipelines
rm -f bitbucket-pipelines.yml