const dataLokasi = {
    asia: ["Jepang", "Indonesia", "Korea Selatan", "India"],
    eropa: ["Jerman", "Prancis", "Italia", "Spanyol"],
    amerika: ["Amerika Serikat", "Argentina", "Kanada", "Brazil", "Mexico"]
}

function inisialisasiBenua() {
    const selectBenua = document.getElementById('benua')

    let defaultOption = document.createElement('option')
    defaultOption.value = ""
    defaultOption.textContent = "--- Pilih Benua ---"
    selectBenua.appendChild(defaultOption)

    for (const benuaKey in dataLokasi) {
        let option = document.createElement('option')
        option.value = benuaKey
        option.textContent = benuaKey.charAt(0).toUpperCase() + benuaKey.slice(1)
        selectBenua.appendChild(option)
    }
}

function updateNegara() {
    const selectBenua = document.getElementById('benua')
    const selectNegara = document.getElementById('negara')
    const hasilElement = document.getElementById('hasil')

    const benuaTerpilih = selectBenua.value
    selectNegara.innerHTML = ''
    hasilElement.textContent = ''

    if (benuaTerpilih) {
        let defaultOption = document.createElement('option')
        defaultOption.value = ""
        defaultOption.textContent = "--- Pilih Negara ---"
        selectNegara.appendChild(defaultOption)

        const negaraArray = dataLokasi[benuaTerpilih]
        negaraArray.forEach(negara => {
            let option = document.createElement('option')
            option.value = negara.toLowerCase().replace(/\s/g, '')
            option.textContent = negara
            selectNegara.appendChild(option)
        })

        selectNegara.onchange = tampilkanHasil 
    
    } else {
        let defaultOption = document.createElement('option')
        defaultOption.value = ""
        defaultOption.textContent = "--- Pilih Benua Dahulu ---"
        selectNegara.appendChild(defaultOption)
    }

}

function tampilkanHasil () {
    const selectBenua = document.getElementById('benua')
    const selectNegara = document.getElementById('negara')
    const hasilElement = document.getElementById('hasil')

    const benuaTeks = selectBenua.options[selectBenua.selectedIndex].textContent
    const negaraTeks = selectNegara.options[selectNegara.selectedIndex].textContent

    if (selectNegara.value) {
        hasilElement.textContent = `Anda memilih : ${negaraTeks}, yang terletak di benua ${benuaTeks}.`
        hasilElement.style.color = 'green'
   
    } else {
        hasilElement.textContent = `Silahkan lengkapi pilihan Anda.`
        hasilElement.style.color = 'orange'
    }

}

document.addEventListener('DOMContentLoaded', inisialisasiBenua)