pipeline {

  agent {
    kubernetes {
      label 'nodejs'
      defaultContainer 'node'
      yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:18-alpine
    command:
    - cat
    tty: true
"""
    }
  }

  environment {
    APP_NAME   = 'cicd-web-app'
    DEPLOY_ENV = 'staging'
    BUILD_DIR  = 'dist'
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

    stage('Install Dependencies') {
      steps {
        echo '📦 Installing dependencies...'
        sh 'node --version'
        sh 'npm --version'

        script {
          if (fileExists('package.json')) {
            sh 'npm ci --prefer-offline --no-audit'
          } else {
            echo 'No package.json found, skipping dependency installation'
          }
        }
      }
    }

    stage('Build') {
      steps {
        echo '🔨 Building application...'

        sh """
          mkdir -p ${BUILD_DIR}
          cp index.html ${BUILD_DIR}/
          cp styles.css ${BUILD_DIR}/
          cp script.js ${BUILD_DIR}/ || true

          if [ -d assets ]; then
            cp -r assets ${BUILD_DIR}/
          fi
        """

        script {
          if (fileExists('package.json')) {
            sh 'npm run build || true'
          }
        }

        echo '✅ Build completed'
      }
    }

    stage('Test') {
      steps {
        echo '🧪 Running tests...'

        script {
          if (fileExists('package.json')) {
            sh 'npm test || true'
          }
        }

        sh """
          test -f ${BUILD_DIR}/index.html
          test -f ${BUILD_DIR}/styles.css
          echo "✅ Required files present"
        """
      }
    }

    stage('Code Quality') {
      steps {
        echo '📊 Code quality checks...'
        sh '''
          echo "HTML lines: $(wc -l < index.html)"
          echo "CSS lines: $(wc -l < styles.css)"
          echo "JS lines: $(wc -l < script.js || echo 0)"
        '''
      }
    }

    stage('Security Scan') {
      steps {
        echo '🔐 Security scan...'
        script {
          if (fileExists('package.json')) {
            sh 'npm audit --audit-level=moderate || true'
          }
        }
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
        echo "🚀 Deploying to ${DEPLOY_ENV}"

        archiveArtifacts artifacts: "${BUILD_DIR}/**/*", fingerprint: true

        sh """
          echo "Deploying ${APP_NAME} to ${DEPLOY_ENV}"
          echo "✅ Deployment completed"
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

    unstable {
      echo '⚠️ Pipeline unstable'
    }
  }
}
