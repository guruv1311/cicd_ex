pipeline {
    agent any

    environment {
        APP_NAME = "cicd-web-app"
        BUILD_DIR = "ocp"
    }

    stages {

        stage('Checkout Source') {
            steps {
                checkout scm
                echo "Source code checked out successfully"
            }
        }

        stage('Create BuildConfig (If Not Exists)') {
            steps {
                script {
                    openshift.withCluster() {
                        openshift.withProject() {
                            if (!openshift.selector("bc", env.APP_NAME).exists()) {
                                echo "Creating BuildConfig ${env.APP_NAME}"
                                openshift.newBuild(
                                    "--name=${env.APP_NAME}",
                                    "--image-stream=nodejs:18-ubi8",
                                    "--binary=true"
                                )
                            } else {
                                echo "BuildConfig ${env.APP_NAME} already exists"
                            }
                        }
                    }
                }
            }
        }

        stage('Start Binary Build') {
            steps {
                script {
                    sh """
                        rm -rf ${BUILD_DIR}
                        mkdir -p ${BUILD_DIR}

                        cp package.json ${BUILD_DIR}/ || true
                        cp -r *.js ${BUILD_DIR}/ || true
                        cp -r *.html ${BUILD_DIR}/ || true
                        cp -r *.css ${BUILD_DIR}/ || true
                    """

                    openshift.withCluster() {
                        openshift.withProject() {
                            echo "Starting binary build from ${BUILD_DIR}"
                            openshift.selector("bc", env.APP_NAME)
                                .startBuild(
                                    "--from-dir=${BUILD_DIR}",
                                    "--follow",
                                    "--wait=true"
                                )
                        }
                    }
                }
            }
        }

        stage('Deploy Application') {
            steps {
                script {
                    openshift.withCluster() {
                        openshift.withProject() {
                            if (!openshift.selector("dc", env.APP_NAME).exists()) {
                                echo "Deploying application ${env.APP_NAME}"
                                def app = openshift.newApp(env.APP_NAME, "--as-deployment-config")
                                app.narrow("svc").expose()
                            } else {
                                echo "Application ${env.APP_NAME} already deployed"
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ CI/CD Pipeline completed successfully"
        }
        failure {
            echo "❌ CI/CD Pipeline failed"
        }
    }
}
