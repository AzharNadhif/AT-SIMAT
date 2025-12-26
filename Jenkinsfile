pipeline {
    agent any

    /* =============================
       PARAMETER USER
       ============================= */
    parameters {

        string(
            name: 'SUITES',
            defaultValue: '',
            description: 'Suite yang ingin dijalankan. Contoh: HRS,receivingConnote'
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
           4. RUN TEST
           ============================= */
        stage('Run Tests') {
            steps {
                script {

                    echo "--- PREPARING TEST EXECUTION ---"
                    def hasTestFailure = false

                    /* =============================
                       1) RUN SPEC
                       ============================= */
                    if (params.SPEC?.trim()) {
                        echo ">>> RUNNING SPEC FILE: ${params.SPEC}"

                        def status = bat(
                            script: "call npx wdio run ./wdio.conf.js --spec ${params.SPEC.trim()}",
                            returnStatus: true
                        )

                        if (status != 0) {
                            echo "❗ SPEC FAILED"
                            hasTestFailure = true
                        }

                    /* =============================
                       2) RUN SUITES (MULTI)
                       ============================= */
                    } else if (params.SUITES?.trim()) {

                        def suiteList = params.SUITES.split(',')

                        suiteList.each { suiteName ->
                            suiteName = suiteName.trim()
                            echo ">>> RUN SUITE: ${suiteName}"

                            def status = bat(
                                script: "call npx wdio run ./wdio.conf.js --suite ${suiteName}",
                                returnStatus: true
                            )

                            if (status != 0) {
                                echo "❗ SUITE FAILED: ${suiteName}"
                                hasTestFailure = true
                            }
                        }

                    /* =============================
                       3) RUN ALL TEST
                       ============================= */
                    } else {
                        echo ">>> RUNNING ALL TESTS"

                        def status = bat(
                            script: "call npx wdio run ./wdio.conf.js",
                            returnStatus: true
                        )

                        if (status != 0) {
                            echo "❗ TEST FAILURES DETECTED"
                            hasTestFailure = true
                        }
                    }

                    /* =============================
                       SET BUILD RESULT
                       ============================= */
                    if (hasTestFailure) {
                        currentBuild.result = 'UNSTABLE'
                        echo "⚠️ BUILD MARKED AS UNSTABLE (TEST FAILURES)"
                    } else {
                        echo "✅ ALL TESTS PASSED"
                    }
                }
            }
        }
    }

    /* =============================
       POST ACTION (ALLURE ALWAYS)
       ============================= */
    post {
        always {
            echo "--- GENERATING ALLURE REPORT ---"
            allure([
                includeProperties: false,
                jdk: '',
                results: [[path: 'allure-results']]
            ])

            echo "--- ARCHIVING ALLURE RESULTS ---"
            archiveArtifacts artifacts: 'allure-results/**', fingerprint: true
        }
    }
}
