pipeline {
    agent {
        label 'nodejs'
    }

    stages {
        stage('Build App') {
            steps {
                checkout scm
                script {
                    echo "Checking node version"
                    sh "node -v"
                    echo "Installing dependencies"
                    // If you have a build script, run it here.
                    // For this simple app, we just ensure dependencies are there.
                    if (fileExists('package.json')) {
                        sh "npm install"
                    }
                }
            }
        }
        
        stage('Create Image Builder') {
            when {
                expression {
                    openshift.withCluster() {
                        openshift.withProject() {
                            return !openshift.selector("bc", "cicd-web-app").exists();
                        }
                    }
                }
            }
            steps {
                script {
                    openshift.withCluster() {
                        openshift.withProject() {
                            // Using nodejs:18-ubi8 as the builder image
                            openshift.newBuild("--name=cicd-web-app", "--image-stream=nodejs:18-ubi8", "--binary=true")
                        }
                    }
                }
            }
        }
        
        stage('Build Image') {
            steps {
                // Prepare the directory structure for binary build
                sh "rm -rf ocp && mkdir -p ocp"
                
                // Copy all relevant files to the ocp directory
                // For a Node.js S2I build, we need package.json and source files
                sh """
                    cp package.json ocp/ || true
                    cp -r *.js ocp/ || true
                    cp -r *.html ocp/ || true
                    cp -r *.css ocp/ || true
                    # If you have an assets folder:
                    # cp -r assets ocp/ || true
                """
                
                script {
                    openshift.withCluster() {
                        openshift.withProject() {
                            // Start binary build from the ocp directory
                            openshift.selector("bc", "cicd-web-app").startBuild("--from-dir=./ocp", "--follow", "--wait=true")
                        }
                    }
                }
            }
        }
        
        stage('Deploy') {
            when {
                expression {
                    openshift.withCluster() {
                        openshift.withProject() {
                            return !openshift.selector('dc', 'cicd-web-app').exists()
                        }
                    }
                }
            }
            steps {
                script {
                    openshift.withCluster() {
                        openshift.withProject() {
                            def app = openshift.newApp("cicd-web-app", "--as-deployment-config")
                            app.narrow("svc").expose();
                        }
                    }
                }
            }
        }
    }
}
