pipeline {
    agent any

    tools {
        nodejs 'NodeJs'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
            post {
                success { echo 'checkout successful' }
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm config set registry https://registry.npmjs.org/'
                bat 'npm config set fetch-retry-mintimeout 20000'
                bat 'npm config set fetch-retry-maxtimeout 120000'
                bat 'npm config set fetch-retries 10'
                bat 'npm config set fetch-timeout 300000'
                bat 'npm config set legacy-peer-deps true'
                bat 'npm cache clean --force'
                bat 'npm install'
            }
            post {
                success { echo 'dependencies installed' }
            }
        }

        stage('Build') {
            steps {
                bat 'npm run build -- --configuration production'
            }
            post {
                success { echo 'build successful' }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshPublisher(
                    publishers: [
                        sshPublisherDesc(
                            configName: 'ec2-angular',
                            transfers: [
                                sshTransfer(
                                    sourceFiles: 'dist/rev-hire-frontend/browser/**',
                                    removePrefix: 'dist/rev-hire-frontend/browser',
                                    remoteDirectory: '/usr/share/nginx/html',
                                    execCommand: 'sudo systemctl restart nginx'
                                )
                            ]
                        )
                    ]
                )
            }
            post {
                success { echo 'deploy successful' }
            }
        }
    }
}
