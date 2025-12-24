pipeline {
    agent any

    /* =============================
       PARAMETER USER
       ============================= */
    parameters {

        string(
            name: 'SUITES',
            defaultValue: '',
            description: 'Suite yang ingin dijalankan. Contoh: HRS,ReceivingConnote'
        )

        string(
            name: 'SPEC',
            defaultValue: '',
            description: 'Jalankan test file tertentu. Contoh: test/specs/HRS/AT-CORE-001.e2e.js'
        )
    }

    stages {

        /* =============================
           1. CLEAN WORKSPACE
           ============================= */
        stage('Clean Workspace') {
            steps {
                echo "--- CLEANING WORKSPACE ---"
                deleteDir()
            }
        }

        /* =============================
           2. CHECKOUT SOURCE
           ============================= */
        stage('Checkout') {
            steps {
                echo "--- CHECKOUT REPO ---"
                checkout scm
            }
        }

        /* =============================
           3. INSTALL DEPENDENCIES
           ============================= */
        stage('Install Dependencies') {
            steps {
                echo "--- NPM INSTALL ---"
                bat "call npm install"
            }
        }

        /* =============================
           4. CLEAN OLD ALLURE RESULT
           ============================= */
        stage('Clean Allure Results') {
            steps {
                echo "--- REMOVING OLD ALLURE FOLDERS ---"
                bat 'if exist allure-results rmdir /s /q allure-results'
                bat 'if exist allure-report rmdir /s /q allure-report'
            }
        }

        /* =============================
           5. RUN TEST
           ============================= */
        stage('Run Tests') {
            steps {
                script {

                    echo "--- PREPARING TEST EXECUTION ---"

                    /* ==================================================
                       PRIORITAS:
                       1) SPEC
                       2) SUITES (multi)
                       3) ALL TESTS
                       ================================================== */

                    // 1) SPEC
                    if (params.SPEC?.trim()) {
                        echo ">>> RUNNING SPEC FILE: ${params.SPEC}"
                        bat """
                            call npx wdio run ./wdio.conf.js --spec ${params.SPEC.trim()}
                            IF %ERRORLEVEL% NEQ 0 exit /b 1
                        """
                        return
                    }

                    // 2) SUITES (bisa multiple)
                    if (params.SUITES?.trim()) {

                        def suiteList = params.SUITES.split(',')

                        suiteList.each { suiteName ->
                            suiteName = suiteName.trim()
                            echo ">>> RUN SUITE: ${suiteName}"

                            bat """
                                call npx wdio run ./wdio.conf.js --suite ${suiteName}
                                echo EXIT CODE: %ERRORLEVEL%
                                IF %ERRORLEVEL% NEQ 0 exit /b 1
                            """
                        }

                        return
                    }

                    // 4) DEFAULT = RUN ALL TEST
                    echo ">>> RUNNING ALL TESTS (no parameter selected)"
                    bat """
                        call npx wdio run ./wdio.conf.js
                        IF %ERRORLEVEL% NEQ 0 exit /b 1
                    """
                }
            }
        }

        /* =============================
           6. GENERATE ALLURE REPORT
           ============================= */
        stage('Generate Allure Report') {
            steps {
                echo "--- GENERATING ALLURE ---"
                allure([
                    includeProperties: false,
                    jdk: '',
                    results: [[path: 'allure-results']]
                ])
            }
        }
    }

    /* =============================
       POST ACTION
       ============================= */
    post {
        always {
            echo "--- ARCHIVING ARTIFACTS ---"
            archiveArtifacts artifacts: 'allure-results/**', fingerprint: true
        }
    }
}
