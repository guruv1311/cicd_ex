pipeline {
  agent any

  environment {
    APP_NAME  = 'cicd-web-app'
    NAMESPACE = 'guru'
  }

  options {
    buildDiscarder(logRotator(numToKeepStr: '10'))
    timeout(time: 30, unit: 'MINUTES')
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build in OpenShift') {
      steps {
        sh """
          oc start-build ${APP_NAME} \
            -n ${NAMESPACE} \
            --wait \
            --follow
        """
      }
    }

    stage('Deploy') {
      steps {
        sh """
          oc rollout status deployment/${APP_NAME} -n ${NAMESPACE}
        """
      }
    }
  }

  post {
    always {
      deleteDir()
    }
  }
}
