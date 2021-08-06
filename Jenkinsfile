pipeline {
    agent any
    stages {
        stage('Checkout SCM') {
          steps {
            cleanWs()
            checkout scm
          }
        }

        stage('Fetch Config') {
          steps {
            sh 'aws s3 cp s3://dx26-ci-cd/config/global/config.json ./.docker/config.json'
            sh 'ls ./.docker'
          }
        }

      stage('Test, Package & Publish') {
        agent {
          docker {
            image 'dx26io/node:8-docker'
            args '-v /var/run/docker.sock:/var/run/docker.sock -v /var/lib/jenkins/workspace/DX26_flair-notifications_master/.docker:/.docker'
            reuseNode true
          }
        }
        steps {
          script {
            echo '[INFO] Test, Package & Publish'
            sh 'git config user.email "integration@dx26.io"'
            sh 'git config user.name "DX26 CI Bot"'
            sh 'ls ~/.docker'
            if (env.BRANCH_NAME == 'master') {
              withCredentials([usernamePassword(
                credentialsId: 'docker-hub',
                usernameVariable: 'DOCKER_USER',
                passwordVariable: 'DOCKER_PASSWORD'
              )]) {
                sh 'git checkout -f master'
                sh './ci-script -du=$DOCKER_USER -dp=$DOCKER_PASSWORD -i=dx26io/data-studio'
              }
              withCredentials([usernamePassword(
                credentialsId: 'github',
                usernameVariable: 'GIT_CREDS_USR',
                passwordVariable: 'GIT_CREDS_PSW'
              )]) {
                sh 'git remote set-url origin https://$GIT_CREDS_USR:$GIT_CREDS_PSW@github.com/DX26-io/flair-notifications.git'
                sh 'git push -u origin master'
                sh 'git push --tags'
              }
            } else {
              echo '[WARN] Tests disabled'
            }
          }
        }
      }
    }
}

// docker build -t dx26io/data-studio .
