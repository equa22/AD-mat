# AD <Bitbucket Pipelines - Pantheon> Script

Author: Uroš Tement <uros.tement@agiledrop.com>

Quick tutorial about how to setup script.

## Getting started

First create basic Pantheon project as project source. Checkout into local folder.

Replace pantheon .gitignore with .gitignore from standard Drupal project.

## Bitbucket SSH key

Generate SSH key on Bitbucket repository settings, Pipelines section.

Put public key in Pantheon account SSH keys section.

## Environment variables

Before running pipeline, environment variables should be set.

### GIT_USER

Name of git user, it is shown on Pantheon commits.

### GIT_EMAIL

Email of git user, it is shown on Pantheon commits.

### SSH_HOST

Line from known_host file for Pantheon server. Bitbucket host query picks wrong host fingerprint, so it has to be manually inserted.

Tip: Create first connection on local environment and copy server line from known_host file to this variable.

### PANTHEON_REPO

Pantheon repository URL, starts with "ssh://". Be careful here since you get whole git clone command in Pantheon settings. Use only repository url here.

### PANTHEON_CODE_PATH

Set path for pantheon repository.

Default is /opt/atlassian/pipelines/agent/pantheon

## Changelog

10.5.2018 Basics