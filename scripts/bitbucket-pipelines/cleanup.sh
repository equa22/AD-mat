#!/bin/sh


# Remove main .git
rm -Rf .git

# Remove .git from modules
rm -Rf modules/contrib/media_entity_browser/.git
rm -Rf modules/contrib/install_profile_generator/.git
rm -Rf  modules/contrib/paragraphs/.git
rm -Rf modules/contrib/slick_paragraphs/.git

# Remove pipelines
rm -rf scripts/bitbucket-pipelines
rm -f bitbucket-pipelines.yml