pipeline {
  agent any

  environment {
    APP_NAME  = 'cicd-web-app'
    NAMESPACE = 'guru'
  }

  options {
    buildDiscarder(logRotator(numToKeepStr: '10'))
    timeout(time: 30, unit: 'MINUTES')
    disableConcurrentBuilds()
  }

  stages {

    stage('Checkout') {
      steps {
        echo '📥 Checking out source code...'
        checkout scm

        script {
          env.GIT_COMMIT_MSG = sh(
            script: "git log -1 --pretty=%B",
            returnStdout: true
          ).trim()

          env.GIT_AUTHOR = sh(
            script: "git log -1 --pretty=%an",
            returnStdout: true
          ).trim()
        }

        echo "Commit: ${env.GIT_COMMIT_MSG}"
        echo "Author: ${env.GIT_AUTHOR}"
      }
    }

    stage('Trigger OpenShift Build') {
      steps {
        echo '🚀 Starting OpenShift BuildConfig build...'
        sh """
          oc start-build ${APP_NAME} \
            -n ${NAMESPACE} \
            --follow
        """
      }
    }

    stage('Deploy') {
      when {
        anyOf {
          branch 'main'
          branch 'master'
        }
      }
      steps {
        echo '📦 Deploying application...'
        sh """
          oc rollout status deployment/${APP_NAME} -n ${NAMESPACE} || true
        """
      }
    }
  }

  post {
    always {
      echo '🧹 Cleaning workspace...'
      deleteDir()
    }

    success {
      echo """
✅ Build #${env.BUILD_NUMBER} succeeded
Project: ${APP_NAME}
Commit: ${env.GIT_COMMIT_MSG}
Author: ${env.GIT_AUTHOR}
"""
    }

    failure {
      echo """
❌ Build #${env.BUILD_NUMBER} failed
Project: ${APP_NAME}
Commit: ${env.GIT_COMMIT_MSG}
Author: ${env.GIT_AUTHOR}
Console: ${env.BUILD_URL}console
"""
    }
  }
}
