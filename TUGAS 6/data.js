// membuat array untuk menyimpan data
var databarang = []

// da[atkan sistem DOM
var modal = document.getElementById("popupModal")
var btnBuka = document.getElementById("bukaFormulir")
var spanTutup = document.getElementsByClassName("tutup" [0])
var form = document.getElementById("formbarang")
var daftar = document.getElementById("daftarbarang")

// fungsi untuk menampilkan data dari HTML
function tampilkanData() {
    daftar.innerHTML = "";

    databarang.forEach(function(item, index) {
        // buat elemen list
        var li = document.createElement("li");
        li.classList.add("barang-item"); // tambahkan class agar bisa distyling via CSS

        // isi dengan HTML agar bisa format lebih rapi
        li.innerHTML = `
            <div class="barang-info">
                <span class="no">${index + 1}.</span>
                <div class="detail">
                    <p><strong>Kode:</strong> ${item.kode}</p>
                    <p><strong>Nama:</strong> ${item.nama}</p>
                    <p><strong>Harga:</strong> Rp ${item.harga}</p>
                </div>
            </div>
        `;

        daftar.appendChild(li);
    });
}


// event : Buka Modal
btnBuka.onclick = function() {
    modal.style.display = "block"
}

// Event : Tutup Modal menggunakan "x"
spanTutup.onclick = function() {
    modal.style.display = "none"
}

// Event : Tutup Modal Jika klik di Luar
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none"
    }
}

// Event : Penanganan Form Submission
form.addEventListener("submit", function(event){
    event.preventDefault() 

    // ambil element input
    var kodeInput = document.getElementById("kode").value
    var namaInput = document.getElementById("nama").value
    var hargaInput = document.getElementById("harga").value

    // buat objek data
    var barangbaru = {
        kode : kodeInput,
        nama : namaInput,
        harga : hargaInput
    }

    // simpan objek ke dalam array
    databarang.push(barangbaru)

    // panggil fungsi untuk memperbarui tampilan
    tampilkanData()

    // reset formulir dan tutup modal
    form.reset()
    modal.style.display = "none"

    console.log("Data Tersimpan : ", databarang)
})

// panggil pertama kali untuk menampilkan array kosong (atau data awal jika ada)
tampilkanData()