pipeline {
  agent any

  environment {
    APP_NAME  = "cicd-web-app"
    NAMESPACE = "guru"
  }

  options {
    buildDiscarder(logRotator(numToKeepStr: '10'))
    timeout(time: 30, unit: 'MINUTES')
    disableConcurrentBuilds()
  }

  stages {

    stage('Checkout') {
      steps {
        echo '📥 Checking out source code'
        checkout scm

        script {
          env.GIT_COMMIT = sh(
            script: "git rev-parse --short HEAD",
            returnStdout: true
          ).trim()
        }
      }
    }

    stage('Start OpenShift Build') {
      steps {
        echo '🚀 Triggering OpenShift BuildConfig'
        sh """
          oc start-build ${APP_NAME} \
            -n ${NAMESPACE} \
            --wait \
            --follow
        """
      }
    }

    stage('Deploy to OpenShift') {
      when {
        branch 'main'
      }
      steps {
        echo '📦 Deploying application'
        sh """
          oc rollout status deployment/${APP_NAME} -n ${NAMESPACE}
        """
      }
    }
  }

  post {
    success {
      echo "✅ Build & Deploy Successful"
    }
    failure {
      echo "❌ Pipeline Failed"
    }
    always {
      deleteDir()
    }
  }
}
