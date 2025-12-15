pipeline {
    agent any
    
    environment {
        // Define environment variables
        NODE_VERSION = '18'
        APP_NAME = 'cicd-web-app'
        DEPLOY_ENV = 'staging'
        BUILD_DIR = 'dist'
    }
    
    options {
        // Keep only last 10 builds
        buildDiscarder(logRotator(numToKeepStr: '10'))
        // Timeout after 30 minutes
        timeout(time: 30, unit: 'MINUTES')
        // Disable concurrent builds
        disableConcurrentBuilds()
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📥 Checking out source code...'
                checkout scm
                
                script {
                    // Get commit information
                    env.GIT_COMMIT_MSG = sh(
                        script: 'git log -1 --pretty=%B',
                        returnStdout: true
                    ).trim()
                    env.GIT_AUTHOR = sh(
                        script: 'git log -1 --pretty=%an',
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
                
                script {
                    // Check if Node.js is installed
                    sh '''
                        node --version || echo "Node.js not found"
                        npm --version || echo "npm not found"
                    '''
                    
                    // Install dependencies if package.json exists
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
                
                script {
                    // Create build directory
                    sh """
                        mkdir -p ${BUILD_DIR}
                        
                        # Copy application files to build directory
                        cp index.html ${BUILD_DIR}/
                        cp styles.css ${BUILD_DIR}/
                        cp script.js ${BUILD_DIR}/
                        
                        # If there are any assets, copy them too
                        if [ -d "assets" ]; then
                            cp -r assets ${BUILD_DIR}/
                        fi
                    """
                    
                    // Run build script if it exists
                    if (fileExists('package.json')) {
                        def packageJson = readJSON file: 'package.json'
                        if (packageJson.scripts?.build) {
                            sh 'npm run build'
                        }
                    }
                }
                
                echo '✅ Build completed successfully'
            }
        }
        
        stage('Test') {
            steps {
                echo '🧪 Running tests...'
                
                script {
                    // Run tests if test script exists
                    if (fileExists('package.json')) {
                        def packageJson = readJSON file: 'package.json'
                        if (packageJson.scripts?.test) {
                            sh 'npm test'
                        } else {
                            echo 'No test script found, skipping tests'
                        }
                    } else {
                        echo 'No package.json found, skipping tests'
                    }
                    
                    // Validate HTML, CSS, JS files exist
                    sh '''
                        echo "Validating build artifacts..."
                        
                        if [ ! -f "${BUILD_DIR}/index.html" ]; then
                            echo "❌ index.html not found in build directory"
                            exit 1
                        fi
                        
                        if [ ! -f "${BUILD_DIR}/styles.css" ]; then
                            echo "❌ styles.css not found in build directory"
                            exit 1
                        fi
                        
                        if [ ! -f "${BUILD_DIR}/script.js" ]; then
                            echo "❌ script.js not found in build directory"
                            exit 1
                        fi
                        
                        echo "✅ All required files present"
                    '''
                }
                
                echo '✅ Tests passed'
            }
        }
        
        stage('Code Quality') {
            steps {
                echo '📊 Running code quality checks...'
                
                script {
                    // Run linting if available
                    if (fileExists('package.json')) {
                        def packageJson = readJSON file: 'package.json'
                        if (packageJson.scripts?.lint) {
                            sh 'npm run lint || true'
                        }
                    }
                    
                    // Count lines of code
                    sh '''
                        echo "=== Code Statistics ==="
                        echo "HTML lines: $(wc -l < index.html)"
                        echo "CSS lines: $(wc -l < styles.css)"
                        echo "JS lines: $(wc -l < script.js)"
                    '''
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                echo '🔐 Running security scan...'
                
                script {
                    // Run npm audit if package.json exists
                    if (fileExists('package.json')) {
                        sh 'npm audit --audit-level=moderate || true'
                    } else {
                        echo 'No package.json found, skipping security scan'
                    }
                }
            }
        }
        
        stage('Deploy') {
            when {
                // Only deploy on main/master branch
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                echo "🚀 Deploying to ${DEPLOY_ENV}..."
                
                script {
                    // Archive build artifacts
                    archiveArtifacts artifacts: "${BUILD_DIR}/**/*", fingerprint: true
                    
                    // Deployment steps (customize based on your deployment target)
                    sh """
                        echo "Deploying ${APP_NAME} to ${DEPLOY_ENV}"
                        
                        # Example: Deploy to a web server
                        # rsync -avz ${BUILD_DIR}/ user@server:/var/www/html/
                        
                        # Example: Deploy to S3
                        # aws s3 sync ${BUILD_DIR}/ s3://your-bucket-name/
                        
                        # Example: Deploy to GitHub Pages
                        # gh-pages -d ${BUILD_DIR}
                        
                        echo "✅ Deployment completed"
                    """
                }
            }
        }
    }
    
    post {
        always {
            echo '🧹 Cleaning up...'
            
            // Clean workspace
            cleanWs(
                deleteDirs: true,
                disableDeferredWipeout: true,
                patterns: [
                    [pattern: 'node_modules', type: 'INCLUDE'],
                    [pattern: BUILD_DIR, type: 'INCLUDE']
                ]
            )
        }
        
        success {
            echo '✅ Pipeline completed successfully!'
            
            script {
                // Send success notification
                def message = """
                    ✅ Build #${env.BUILD_NUMBER} succeeded
                    
                    Project: ${APP_NAME}
                    Branch: ${env.BRANCH_NAME}
                    Commit: ${env.GIT_COMMIT_MSG}
                    Author: ${env.GIT_AUTHOR}
                    Duration: ${currentBuild.durationString}
                """
                
                echo message
                
                // Uncomment to send notifications
                // emailext(
                //     subject: "✅ Build Success: ${APP_NAME} #${env.BUILD_NUMBER}",
                //     body: message,
                //     to: 'team@example.com'
                // )
                
                // slackSend(
                //     color: 'good',
                //     message: message
                // )
            }
        }
        
        failure {
            echo '❌ Pipeline failed!'
            
            script {
                // Send failure notification
                def message = """
                    ❌ Build #${env.BUILD_NUMBER} failed
                    
                    Project: ${APP_NAME}
                    Branch: ${env.BRANCH_NAME}
                    Commit: ${env.GIT_COMMIT_MSG}
                    Author: ${env.GIT_AUTHOR}
                    Duration: ${currentBuild.durationString}
                    
                    Check console output: ${env.BUILD_URL}console
                """
                
                echo message
                
                // Uncomment to send notifications
                // emailext(
                //     subject: "❌ Build Failed: ${APP_NAME} #${env.BUILD_NUMBER}",
                //     body: message,
                //     to: 'team@example.com'
                // )
                
                // slackSend(
                //     color: 'danger',
                //     message: message
                // )
            }
        }
        
        unstable {
            echo '⚠️ Pipeline is unstable'
        }
    }
}
