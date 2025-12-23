# Core CMS Automation Test

Automation test untuk **Core CMS** menggunakan **WebdriverIO**. Repo ini berisi konfigurasi, page objects, dan skenario end‑to‑end (E2E) untuk memverifikasi fitur-fitur utama.

## Prasyarat

- **Node.js** (disarankan versi LTS) & **npm**  
   Cek versi: `node -v`
- Akses ke repository ini

---

## Quick Start

Clone repo, pindah branch dan install dependency:

```bash
git clone https://github.com/jneindonesia/core-cms-automation-test.git
cd core-cms-automation-test
git checkout TheCore-Test
npm install

```

---

## Menjalankan Test

### Menjalankan semua test (per suite)

- **Receiving Connote**

```bash
npx wdio run wdio.conf.js --suite receivingConnote

```
### Menjalankan satu file test tertentu

Contoh untuk `createRegBag.e2e.js`:

```bash
npx wdio run wdio.conf.js --spec ./test/specs/Outgoing-Bag/createRegBag.e2e.js

```

---

## Struktur Proyek

```ini
├── test/
│   ├── helpers/          # Helper function & test data
│   ├── pageobjects/      # Page Object Pattern
│   └── specs/            # Skenario test (E2E)
├── wdio.conf.js          # Konfigurasi WebdriverIO
├── package.json
├── package-lock.json

```

---

## Laporan Allure

1. Install Allure (global):

    ```bash
    npm install -g allure-commandline
    ```
    

3. Generate report:

    ```bash
    npx allure generate allure-results --clean -o allure-report
    ```
    

4. Buka report:

    ```bash
    npx allure open allure-report
    ```
    

> **Catatan:** Folder `allure-results` dibuat otomatis setelah test dijalankan.

---

## Troubleshooting

- __Gagal install dependency__  
   Hapus `node_modules` dan `package-lock.json`, lalu `npm install`.
- **Tidak muncul hasil Allure**  
   Pastikan test sudah jalan dan folder `allure-results` ada.
- **Path spesifikasi salah**  
   Cek kembali path file di argumen `--spec`.
