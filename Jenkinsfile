pipeline {
  agent any

  environment {
    APP_NAME  = 'cicd-web-app'
    NAMESPACE = 'guru'
  }

  options {
    timeout(time: 30, unit: 'MINUTES')
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }

  stages {

    stage('Checkout') {
      steps {
        echo '📥 Checking out source code'
        checkout scm
      }
    }

    stage('Build & Deploy') {
      steps {
        echo '🚀 Deploying application'

        sh """
          oc rollout status deployment/${APP_NAME} -n ${NAMESPACE} || true
        """
      }
    }
  }

  post {
    success {
      echo '✅ Pipeline completed successfully'
    }
    failure {
      echo '❌ Pipeline failed'
    }
    always {
      deleteDir()
    }
  }
}
