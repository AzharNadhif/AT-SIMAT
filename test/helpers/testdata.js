class TestData {
    // ======= DATA LOGIN =======
    static getCredentials(name = "SUB") {
        const username = process.env[`${name.toUpperCase()}_USERNAME`];
        const password = process.env[`${name.toUpperCase()}_PASSWORD`];

        if (!username || !password) {
            throw new Error(`Credentials untuk ${name} tidak ditemukan di .env`);
        }

        return { username, password };
    } 
   
    //  ======= DATA CONNOTE COD =======
    static generateConnoteCOD() {
        return {
            namaPengirim: "TES RECEIVING",
            teleponPengirim: "8123456789",
            alamatPengirim: "BANDUNG BLOK 1",
            provinsiPengirim: "BANDUNG",
            namaPenerima: "TES PENERIMA",
            teleponPenerima: "8123456779",
            alamatPenerima: "BRAGA BLOK 12",
            provinsiPenerima: "40111",
            deskripsiBarang: "IKAN",
            kategori: "Makanan",
            service: "CTC",
            cod: "18000",
            jumlah: "1",
            weight: "2",
            length: "1",
            width: "1",
            height: "1",
        }
    }

    //  ======= DATA CONNOTE OUTGOING =======
    static generateConnoteOutgoing() {
        return {
            namaPengirim: "TES RECEIVING",
            teleponPengirim: "8123456789",
            alamatPengirim: "BANDUNG BLOK 1",
            provinsiPengirim: "BANDUNG",
            namaPenerima: "TES PENERIMA",
            teleponPenerima: "8123456779",
            alamatPenerima: "SURABAYA TES",
            provinsiPenerima: "60286",
            deskripsiBarang: "IKAN",
            kategori: "Makanan",
            service: "REG",
            jumlah: "1",
            weight: "2",
            length: "1",
            width: "1",
            height: "1",
        }
    }
}
export default TestData;